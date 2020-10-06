!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.PointEmitter=t():n.PointEmitter=t()}(this,(function(){return function(n){var t={};function e(c){if(t[c])return t[c].exports;var l=t[c]={i:c,l:!1,exports:{}};return n[c].call(l.exports,l,l.exports,e),l.l=!0,l.exports}return e.m=n,e.c=t,e.d=function(n,t,c){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:c})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var c=Object.create(null);if(e.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var l in n)e.d(c,l,function(t){return n[t]}.bind(null,l));return c},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=0)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar EVENT_TYPE;\r\n(function (EVENT_TYPE) {\r\n    EVENT_TYPE["BEFORE_SELECT"] = "BEFORE_SELECT";\r\n    EVENT_TYPE["SELECT_START"] = "SELECT_START";\r\n    EVENT_TYPE["SELECTING"] = "SELECTING";\r\n    EVENT_TYPE["SELECT"] = "SELECT";\r\n    EVENT_TYPE["CLICK"] = "CLICK";\r\n    EVENT_TYPE["DB_CLICK"] = "DB_CLICK";\r\n    EVENT_TYPE["TOUCH_EDGES"] = "TOUCH_EDGES";\r\n    EVENT_TYPE["BEFORE_CREATE_GHOST"] = "BEFORE_CREATE_GHOST";\r\n    EVENT_TYPE["RESET"] = "RESET";\r\n})(EVENT_TYPE || (EVENT_TYPE = {}));\r\nvar DIRECTION;\r\n(function (DIRECTION) {\r\n    DIRECTION["TOP"] = "TOP";\r\n    DIRECTION["RIGHT"] = "RIGHT";\r\n    DIRECTION["BOTTOM"] = "BOTTOM";\r\n    DIRECTION["LEFT"] = "LEFT";\r\n})(DIRECTION || (DIRECTION = {}));\r\nvar PointEmitter = /** @class */ (function () {\r\n    function PointEmitter(node, _a) {\r\n        var _this = this;\r\n        var _b = _a === void 0 ? {} : _a, _c = _b.longPressThreshold, longPressThreshold = _c === void 0 ? 250 : _c, _d = _b.gridMovement, gridMovement = _d === void 0 ? 0 : _d, _e = _b.ghost, ghost = _e === void 0 ? { enable: false } : _e;\r\n        this.clickTolerance = 5;\r\n        this.clickInterval = 250;\r\n        this.currentWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;\r\n        this.currentWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;\r\n        this.destroy = function () {\r\n            _this.node = null;\r\n            _this.listeners = Object.create(null);\r\n            _this.initialEventData = null;\r\n            _this.origDistanceFromXToNode = null;\r\n            _this.origDistanceFromYToNode = null;\r\n            _this.selecting = false;\r\n            _this.selectEventData = null;\r\n            _this.lastClickData = null;\r\n            _this.removeInitialEventListener && _this.removeInitialEventListener();\r\n            _this.removeMoveListener && _this.removeMoveListener();\r\n            _this.removeEndListener && _this.removeEndListener();\r\n            _this.removeKeyListener && _this.removeKeyListener();\r\n            _this.removeTouchMoveWindowListener && _this.removeTouchMoveWindowListener();\r\n        };\r\n        /* getter setter */\r\n        /* wrapper for add event listener */\r\n        this.listener = function (type, handler, target) {\r\n            target && target.addEventListener(type, handler, { passive: false });\r\n            !target && _this.node.addEventListener(type, handler, { passive: false });\r\n            return function () {\r\n                target && target.removeEventListener(type, handler, { passive: false });\r\n                !target && _this.node.removeEventListener(type, handler);\r\n            };\r\n        };\r\n        /* wrapper for add event listener */\r\n        /*  */\r\n        this.getBoundingRect = function (node) {\r\n            if (!node)\r\n                return;\r\n            var nodeBox = node.getBoundingClientRect();\r\n            return {\r\n                top: nodeBox.top,\r\n                left: nodeBox.left,\r\n                width: nodeBox.width,\r\n                height: nodeBox.height,\r\n            };\r\n        };\r\n        /*  */\r\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\r\n        this.onInitialEventListener = function () {\r\n            if (!_this.node)\r\n                return;\r\n            var removeTouchStartListener = _this.listener("touchstart", function (e) {\r\n                _this.removeInitialEventListener();\r\n                _this.removeInitialEventListener = _this.onAddLongPressListener(_this.onHandleEventListener, e);\r\n            });\r\n            var removeMouseDownListener = _this.listener("mousedown", function (e) {\r\n                _this.removeInitialEventListener();\r\n                _this.onHandleEventListener(e);\r\n                _this.removeInitialEventListener = _this.listener("mousedown", _this.onHandleEventListener);\r\n            });\r\n            _this.removeInitialEventListener = function () {\r\n                removeTouchStartListener();\r\n                removeMouseDownListener();\r\n            };\r\n        };\r\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\r\n        /* handling event */\r\n        this.onHandleEventListener = function (e) {\r\n            var _a = _this.getEventCoords(e), isTouch = _a.isTouch, x = _a.x, y = _a.y;\r\n            var _b = _this.getBoundingRect(_this.node), top = _b.top, left = _b.left;\r\n            _this.origDistanceFromYToNode = y - top;\r\n            _this.origDistanceFromXToNode = x - left;\r\n            _this.selectEventData = { x: x, y: y };\r\n            _this.initialEventData = { isTouch: isTouch, x: x, y: y };\r\n            _this.onCreateGhostEl(_this.node);\r\n            _this.emit(EVENT_TYPE.BEFORE_SELECT, _this.initialEventData);\r\n            switch (e.type) {\r\n                case "touchstart":\r\n                    _this.removeMoveListener = _this.listener("touchmove", _this.onMoveListener, window);\r\n                    _this.removeEndListener = _this.listener("touchend", _this.onEndListener, window);\r\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\r\n                    break;\r\n                case "mousedown":\r\n                    _this.removeMoveListener = _this.listener("mousemove", _this.onMoveListener, window);\r\n                    _this.removeEndListener = _this.listener("mouseup", _this.onEndListener, window);\r\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        };\r\n        /* add long press listener if user touch the screen without moving their finger for 250ms */\r\n        this.onAddLongPressListener = function (handleEventListener, e) {\r\n            var longPressTimer = null;\r\n            var removeTouchMoveListener = null;\r\n            var removeToucEndListener = null;\r\n            var cleanup = function () {\r\n                longPressTimer && clearTimeout(longPressTimer);\r\n                removeTouchMoveListener && removeTouchMoveListener();\r\n                removeToucEndListener && removeToucEndListener();\r\n                longPressTimer = null;\r\n                removeTouchMoveListener = null;\r\n                removeToucEndListener = null;\r\n            };\r\n            var onTouchStart = function (e) {\r\n                longPressTimer = setTimeout(function () {\r\n                    cleanup();\r\n                    handleEventListener(e);\r\n                }, _this.longPressThreshold);\r\n                removeTouchMoveListener = _this.listener("touchmove", function () { return cleanup(); });\r\n                removeToucEndListener = _this.listener("touchend", function () { return cleanup(); });\r\n            };\r\n            var removeTouchStartListener = _this.listener("touchstart", onTouchStart);\r\n            e && onTouchStart(e);\r\n            return function () {\r\n                cleanup();\r\n                removeTouchStartListener();\r\n            };\r\n        };\r\n        this.onMoveListener = function (e) {\r\n            if (!_this.initialEventData)\r\n                return;\r\n            var _a = _this.initialEventData, initX = _a.x, initY = _a.y;\r\n            var _b = _this.getEventCoords(e), x = _b.x, y = _b.y;\r\n            var origSelecting = _this.selecting, distanceFromInitXToX = Math.abs(initX - x), distanceFromInitYToY = Math.abs(initY - y), click = _this.isClick(x, y);\r\n            // Prevent emitting selectStart event until mouse is moved.\r\n            // in Chrome on Windows, mouseMove event may be fired just after mouseDown event.\r\n            if (_this.isClick(x, y) && !origSelecting && !(distanceFromInitXToX || distanceFromInitYToY))\r\n                return;\r\n            var afterX = x - _this.origDistanceFromXToNode;\r\n            var afterY = y - _this.origDistanceFromYToNode;\r\n            if (_this.gridMovement) {\r\n                afterX = _this.calcGridMovement(afterX);\r\n                afterY = _this.calcGridMovement(afterY);\r\n            }\r\n            _this.selectEventData = { x: afterX, y: afterY };\r\n            _this.selecting = true;\r\n            !origSelecting && _this.emit(EVENT_TYPE.SELECT_START, { x: initX, y: initY });\r\n            !click && _this.emit(EVENT_TYPE.SELECTING, _this.selectEventData);\r\n            var _c = _this.touchEdges(x, y), touch = _c.touch, dir = _c.dir;\r\n            if (touch) {\r\n                return _this.emit(EVENT_TYPE.TOUCH_EDGES, __assign(__assign({}, _this.selectEventData), { dir: dir }));\r\n            }\r\n            e.preventDefault();\r\n        };\r\n        this.onEndListener = function (e) {\r\n            if (!_this.initialEventData)\r\n                return;\r\n            _this.onDelGhostEl();\r\n            _this.removeMoveListener && _this.removeMoveListener();\r\n            _this.removeEndListener && _this.removeEndListener();\r\n            _this.removeKeyListener && _this.removeKeyListener();\r\n            _this.selecting = false;\r\n            var inRoot = _this.node.contains(e.target);\r\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\r\n            var click = _this.isClick(x, y);\r\n            if (e.key) {\r\n                return _this.emit(EVENT_TYPE.RESET, _this.selectEventData);\r\n            }\r\n            if (click && inRoot)\r\n                return _this.onClickListener(e);\r\n            if (!click)\r\n                return _this.emit(EVENT_TYPE.SELECT, _this.selectEventData);\r\n        };\r\n        this.onClickListener = function (e) {\r\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\r\n            var now = new Date().getTime();\r\n            if (_this.lastClickData && now - _this.lastClickData <= _this.clickInterval) {\r\n                _this.lastClickData = null;\r\n                return _this.emit(EVENT_TYPE.DB_CLICK, { x: x, y: y });\r\n            }\r\n            _this.lastClickData = now;\r\n            return _this.emit(EVENT_TYPE.CLICK, { x: x, y: y });\r\n        };\r\n        this.getEventCoords = function (e) {\r\n            var coords = {\r\n                isTouch: false,\r\n                x: e.pageX,\r\n                y: e.pageY,\r\n            };\r\n            /* if (e.touches && e.touches.length) {\r\n              coords.isTouch = true;\r\n              coords.x = e.touches[0].pageX;\r\n              coords.y = e.touches[0].pageY;\r\n            } */\r\n            /* try new way =)) */\r\n            e.touches &&\r\n                e.touches.length &&\r\n                ((coords.isTouch = true), (coords.x = e.touches[0].pageX), (coords.y = e.touches[0].pageY));\r\n            return coords;\r\n        };\r\n        this.isClick = function (currX, currY) {\r\n            var _a = _this.initialEventData, isTouch = _a.isTouch, x = _a.x, y = _a.y;\r\n            return !isTouch && Math.abs(currX - x) <= _this.clickTolerance && Math.abs(currY - y) <= _this.clickTolerance;\r\n        };\r\n        this.touchEdges = function (x, y) {\r\n            var _a = _this.getBoundingRect(_this.node), width = _a.width, height = _a.height;\r\n            var afterX = x - _this.origDistanceFromXToNode;\r\n            var afterY = y - _this.origDistanceFromYToNode;\r\n            if (afterX < 0) {\r\n                return { touch: true, dir: DIRECTION.LEFT };\r\n            }\r\n            if (afterX + width > _this.currentWindowWidth) {\r\n                return { touch: true, dir: DIRECTION.RIGHT };\r\n            }\r\n            if (afterY < 0) {\r\n                return { touch: true, dir: DIRECTION.TOP };\r\n            }\r\n            if (afterY + height > _this.currentWindowHeight) {\r\n                return { touch: true, dir: DIRECTION.BOTTOM };\r\n            }\r\n            return { touch: false, dir: null };\r\n        };\r\n        this.calcGridMovement = function (currPosition) {\r\n            return Math.floor(currPosition / _this.gridMovement) * _this.gridMovement;\r\n        };\r\n        /* handling event */\r\n        /* DOM manipulation */\r\n        this.onCreateGhostEl = function (node) {\r\n            // create ghost el\r\n            if (_this.ghost && _this.ghost.enable) {\r\n                var ghost = node.cloneNode(true);\r\n                ghost.id = "pe-ghost";\r\n                if (_this.ghost.style) {\r\n                    for (var s in _this.ghost.style) {\r\n                        if (_this.ghost.style[s]) {\r\n                            ghost.style[s] = _this.ghost.style[s];\r\n                        }\r\n                    }\r\n                }\r\n                _this.emit(EVENT_TYPE.BEFORE_CREATE_GHOST, ghost);\r\n                _this.bodyEl.insertBefore(ghost, node);\r\n            }\r\n        };\r\n        this.onDelGhostEl = function () { return _this.ghost && _this.ghost.enable && document.querySelector("#pe-ghost").remove(); };\r\n        /* DOM manipulation */\r\n        /* Inspire by EventEmiiter, turnsout it\'s PubSub pattern */\r\n        this.on = function (type, handler) {\r\n            var idx = (_this.listeners[type] || (_this.listeners[type] = [])).push(handler) - 1;\r\n            return {\r\n                off: function () {\r\n                    this.listeners[type].splice(idx, 1);\r\n                },\r\n            };\r\n        };\r\n        this.emit = function (type) {\r\n            var args = [];\r\n            for (var _i = 1; _i < arguments.length; _i++) {\r\n                args[_i - 1] = arguments[_i];\r\n            }\r\n            (_this.listeners[type] || []).forEach(function (fn) {\r\n                fn.apply(void 0, args);\r\n            });\r\n        };\r\n        this.node = node;\r\n        this.listeners = Object.create(null);\r\n        this.selecting = false;\r\n        this.longPressThreshold = longPressThreshold;\r\n        this.gridMovement = gridMovement;\r\n        this.ghost = ghost;\r\n        this.bodyEl = document.querySelector("body");\r\n        // Fixes an iOS 10 bug where scrolling could not be prevented on the window.\r\n        this.removeTouchMoveWindowListener = this.listener("touchmove", function () { }, window);\r\n        this.onInitialEventListener();\r\n    }\r\n    Object.defineProperty(PointEmitter.prototype, "getNode", {\r\n        /* getter setter */\r\n        get: function () {\r\n            return this.node;\r\n        },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(PointEmitter.prototype, "getListeners", {\r\n        get: function () {\r\n            return this.listeners;\r\n        },\r\n        enumerable: false,\r\n        configurable: true\r\n    });\r\n    return PointEmitter;\r\n}());\r\n/* harmony default export */ __webpack_exports__["default"] = (PointEmitter);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL1BvaW50RW1pdHRlci8uL3NyYy9pbmRleC50cz9mZmI0Il0sInNvdXJjZXNDb250ZW50IjpbImVudW0gRVZFTlRfVFlQRSB7XHJcbiAgQkVGT1JFX1NFTEVDVCA9IFwiQkVGT1JFX1NFTEVDVFwiLFxyXG4gIFNFTEVDVF9TVEFSVCA9IFwiU0VMRUNUX1NUQVJUXCIsXHJcbiAgU0VMRUNUSU5HID0gXCJTRUxFQ1RJTkdcIixcclxuICBTRUxFQ1QgPSBcIlNFTEVDVFwiLFxyXG4gIENMSUNLID0gXCJDTElDS1wiLFxyXG4gIERCX0NMSUNLID0gXCJEQl9DTElDS1wiLFxyXG4gIFRPVUNIX0VER0VTID0gXCJUT1VDSF9FREdFU1wiLFxyXG4gIEJFRk9SRV9DUkVBVEVfR0hPU1QgPSBcIkJFRk9SRV9DUkVBVEVfR0hPU1RcIixcclxuICBSRVNFVCA9IFwiUkVTRVRcIixcclxufVxyXG5cclxuZW51bSBESVJFQ1RJT04ge1xyXG4gIFRPUCA9IFwiVE9QXCIsXHJcbiAgUklHSFQgPSBcIlJJR0hUXCIsXHJcbiAgQk9UVE9NID0gXCJCT1RUT01cIixcclxuICBMRUZUID0gXCJMRUZUXCIsXHJcbn1cclxuXHJcbnR5cGUgUG9pbnREYXRhID0ge1xyXG4gIHg6IG51bWJlcjtcclxuICB5OiBudW1iZXI7XHJcbn07XHJcblxyXG50eXBlIEVkZ2VEYXRhID0gUG9pbnREYXRhICYge1xyXG4gIGRpcjogRElSRUNUSU9OO1xyXG59O1xyXG5cclxudHlwZSBFdmVudERhdGEgPSBQb2ludERhdGEgJiB7XHJcbiAgaXNUb3VjaDogYm9vbGVhbjtcclxufTtcclxuXHJcbnR5cGUgQm94RGF0YSA9IHtcclxuICB0b3A6IG51bWJlcjtcclxuICBsZWZ0OiBudW1iZXI7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxufTtcclxuXHJcbnR5cGUgTGlzdGVuZXJEYXRhID0geyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbltdIH07XHJcblxyXG50eXBlIEdob3N0ID0ge1xyXG4gIGVuYWJsZTogYm9vbGVhbjtcclxuICBzdHlsZT86IENTU1N0eWxlRGVjbGFyYXRpb247XHJcbn07XHJcblxyXG5jbGFzcyBQb2ludEVtaXR0ZXIge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgY2xpY2tUb2xlcmFuY2U6IG51bWJlciA9IDU7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBjbGlja0ludGVydmFsOiBudW1iZXIgPSAyNTA7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgY3VycmVudFdpbmRvd1dpZHRoOiBudW1iZXIgPVxyXG4gICAgd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgY3VycmVudFdpbmRvd0hlaWdodDogbnVtYmVyID1cclxuICAgIHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBwcml2YXRlIGxvbmdQcmVzc1RocmVzaG9sZDogbnVtYmVyO1xyXG4gIHByaXZhdGUgZ3JpZE1vdmVtZW50OiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBnaG9zdDogR2hvc3Q7XHJcblxyXG4gIHByaXZhdGUgYm9keUVsOiBIVE1MQm9keUVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgbm9kZTogRWxlbWVudCB8IG51bGw7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IExpc3RlbmVyRGF0YTtcclxuICBwcml2YXRlIGluaXRpYWxFdmVudERhdGE6IEV2ZW50RGF0YSB8IG51bGw7XHJcbiAgcHJpdmF0ZSBvcmlnRGlzdGFuY2VGcm9tWFRvTm9kZTogbnVtYmVyIHwgbnVsbDtcclxuICBwcml2YXRlIG9yaWdEaXN0YW5jZUZyb21ZVG9Ob2RlOiBudW1iZXIgfCBudWxsO1xyXG4gIHByaXZhdGUgc2VsZWN0aW5nOiBib29sZWFuO1xyXG4gIHByaXZhdGUgc2VsZWN0RXZlbnREYXRhOiBQb2ludERhdGEgfCBudWxsOyAvLyBzYXZlIGN1cnJYICYgY3VyclkgZm9yIFNFTEVDVElORyAmIFNFTEVDVCB0eXBlIGNhdXNlIFwidG91Y2hFbmRcIiBkb2Vzbid0IGhhdmUgXCJwYWdlWCwgcGFnZVlcIlxyXG4gIHByaXZhdGUgbGFzdENsaWNrRGF0YTogbnVtYmVyIHwgbnVsbDsgLy8gc2F2ZSBsYXN0IGNsaWNrIHRvIGNvbXBhcmUgd2l0aCBsYXRlc3QgY2xpY2sgZm9yIERCX0NMSUNLIHR5cGVcclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSByZW1vdmVNb3ZlTGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gIHByaXZhdGUgcmVtb3ZlRW5kTGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gIHByaXZhdGUgcmVtb3ZlS2V5TGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gIHByaXZhdGUgcmVtb3ZlVG91Y2hNb3ZlV2luZG93TGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihub2RlOiBFbGVtZW50IHwgbnVsbCwgeyBsb25nUHJlc3NUaHJlc2hvbGQgPSAyNTAsIGdyaWRNb3ZlbWVudCA9IDAsIGdob3N0ID0geyBlbmFibGU6IGZhbHNlIH0gfSA9IHt9KSB7XHJcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgdGhpcy5zZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMubG9uZ1ByZXNzVGhyZXNob2xkID0gbG9uZ1ByZXNzVGhyZXNob2xkO1xyXG4gICAgdGhpcy5ncmlkTW92ZW1lbnQgPSBncmlkTW92ZW1lbnQ7XHJcbiAgICB0aGlzLmdob3N0ID0gZ2hvc3Q7XHJcblxyXG4gICAgdGhpcy5ib2R5RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICAgIC8vIEZpeGVzIGFuIGlPUyAxMCBidWcgd2hlcmUgc2Nyb2xsaW5nIGNvdWxkIG5vdCBiZSBwcmV2ZW50ZWQgb24gdGhlIHdpbmRvdy5cclxuICAgIHRoaXMucmVtb3ZlVG91Y2hNb3ZlV2luZG93TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwidG91Y2htb3ZlXCIsICgpID0+IHt9LCB3aW5kb3cpO1xyXG5cclxuICAgIHRoaXMub25Jbml0aWFsRXZlbnRMaXN0ZW5lcigpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSA9ICgpID0+IHtcclxuICAgIHRoaXMubm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICB0aGlzLmluaXRpYWxFdmVudERhdGEgPSBudWxsO1xyXG4gICAgdGhpcy5vcmlnRGlzdGFuY2VGcm9tWFRvTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLm9yaWdEaXN0YW5jZUZyb21ZVG9Ob2RlID0gbnVsbDtcclxuICAgIHRoaXMuc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLnNlbGVjdEV2ZW50RGF0YSA9IG51bGw7XHJcbiAgICB0aGlzLmxhc3RDbGlja0RhdGEgPSBudWxsO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lciAmJiB0aGlzLnJlbW92ZUtleUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnJlbW92ZVRvdWNoTW92ZVdpbmRvd0xpc3RlbmVyICYmIHRoaXMucmVtb3ZlVG91Y2hNb3ZlV2luZG93TGlzdGVuZXIoKTtcclxuICB9O1xyXG4gIC8qIGdldHRlciBzZXR0ZXIgKi9cclxuICBnZXQgZ2V0Tm9kZSgpOiBFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLm5vZGU7XHJcbiAgfVxyXG5cclxuICBnZXQgZ2V0TGlzdGVuZXJzKCk6IExpc3RlbmVyRGF0YSB7XHJcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnM7XHJcbiAgfVxyXG4gIC8qIGdldHRlciBzZXR0ZXIgKi9cclxuXHJcbiAgLyogd3JhcHBlciBmb3IgYWRkIGV2ZW50IGxpc3RlbmVyICovXHJcbiAgbGlzdGVuZXIgPSAodHlwZTogc3RyaW5nLCBoYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0LCB0YXJnZXQ/OiBhbnkpID0+IHtcclxuICAgIHRhcmdldCAmJiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG4gICAgIXRhcmdldCAmJiB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHRhcmdldCAmJiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG4gICAgICAhdGFyZ2V0ICYmIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIC8qIHdyYXBwZXIgZm9yIGFkZCBldmVudCBsaXN0ZW5lciAqL1xyXG5cclxuICAvKiAgKi9cclxuICBnZXRCb3VuZGluZ1JlY3QgPSAobm9kZTogRWxlbWVudCk6IEJveERhdGEgPT4ge1xyXG4gICAgaWYgKCFub2RlKSByZXR1cm47XHJcblxyXG4gICAgY29uc3Qgbm9kZUJveDogRE9NUmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3A6IG5vZGVCb3gudG9wLFxyXG4gICAgICBsZWZ0OiBub2RlQm94LmxlZnQsXHJcbiAgICAgIHdpZHRoOiBub2RlQm94LndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IG5vZGVCb3guaGVpZ2h0LFxyXG4gICAgfTtcclxuICB9O1xyXG4gIC8qICAqL1xyXG5cclxuICAvKiBMaXN0ZW4gZm9yIG1vdXNlZG93biAmIHRvdWNoc3RhcnQuIFdoZW4gb25lIGlzIHJlY2VpdmVkLCBkaXNhYmxlZCB0aGUgb3RoZXIgYW5kIHNldHVwIGZ1dHVyZSBldmVudCBiYXNlIG9uIHR5cGUgKi9cclxuICBvbkluaXRpYWxFdmVudExpc3RlbmVyID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCByZW1vdmVUb3VjaFN0YXJ0TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZSkgPT4ge1xyXG4gICAgICB0aGlzLnJlbW92ZUluaXRpYWxFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIgPSB0aGlzLm9uQWRkTG9uZ1ByZXNzTGlzdGVuZXIodGhpcy5vbkhhbmRsZUV2ZW50TGlzdGVuZXIsIGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlTW91c2VEb3duTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XHJcbiAgICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgdGhpcy5vbkhhbmRsZUV2ZW50TGlzdGVuZXIoZSk7XHJcbiAgICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMub25IYW5kbGVFdmVudExpc3RlbmVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICAgIHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lcigpO1xyXG4gICAgICByZW1vdmVNb3VzZURvd25MaXN0ZW5lcigpO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIC8qIExpc3RlbiBmb3IgbW91c2Vkb3duICYgdG91Y2hzdGFydC4gV2hlbiBvbmUgaXMgcmVjZWl2ZWQsIGRpc2FibGVkIHRoZSBvdGhlciBhbmQgc2V0dXAgZnV0dXJlIGV2ZW50IGJhc2Ugb24gdHlwZSAqL1xyXG5cclxuICAvKiBoYW5kbGluZyBldmVudCAqL1xyXG4gIG9uSGFuZGxlRXZlbnRMaXN0ZW5lciA9IChlOiBhbnkpID0+IHtcclxuICAgIGNvbnN0IHsgaXNUb3VjaCwgeCwgeSB9ID0gdGhpcy5nZXRFdmVudENvb3JkcyhlKTtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLmdldEJvdW5kaW5nUmVjdCh0aGlzLm5vZGUpO1xyXG4gICAgdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZSA9IHkgLSB0b3A7XHJcbiAgICB0aGlzLm9yaWdEaXN0YW5jZUZyb21YVG9Ob2RlID0geCAtIGxlZnQ7XHJcbiAgICB0aGlzLnNlbGVjdEV2ZW50RGF0YSA9IHsgeCwgeSB9O1xyXG4gICAgdGhpcy5pbml0aWFsRXZlbnREYXRhID0geyBpc1RvdWNoLCB4LCB5IH07XHJcblxyXG4gICAgdGhpcy5vbkNyZWF0ZUdob3N0RWwodGhpcy5ub2RlKTtcclxuICAgIHRoaXMuZW1pdChFVkVOVF9UWVBFLkJFRk9SRV9TRUxFQ1QsIHRoaXMuaW5pdGlhbEV2ZW50RGF0YSk7XHJcblxyXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcclxuICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcclxuICAgICAgICB0aGlzLnJlbW92ZU1vdmVMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vbk1vdmVMaXN0ZW5lciwgd2luZG93KTtcclxuICAgICAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25FbmRMaXN0ZW5lciwgd2luZG93KTtcclxuICAgICAgICB0aGlzLnJlbW92ZUtleUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbkVuZExpc3RlbmVyLCB3aW5kb3cpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwibW91c2Vkb3duXCI6XHJcbiAgICAgICAgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMub25Nb3ZlTGlzdGVuZXIsIHdpbmRvdyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25FbmRMaXN0ZW5lciwgd2luZG93KTtcclxuICAgICAgICB0aGlzLnJlbW92ZUtleUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbkVuZExpc3RlbmVyLCB3aW5kb3cpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qIGFkZCBsb25nIHByZXNzIGxpc3RlbmVyIGlmIHVzZXIgdG91Y2ggdGhlIHNjcmVlbiB3aXRob3V0IG1vdmluZyB0aGVpciBmaW5nZXIgZm9yIDI1MG1zICovXHJcbiAgb25BZGRMb25nUHJlc3NMaXN0ZW5lciA9IChoYW5kbGVFdmVudExpc3RlbmVyOiBGdW5jdGlvbiwgZTogYW55KSA9PiB7XHJcbiAgICBsZXQgbG9uZ1ByZXNzVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IHJlbW92ZVRvdWNFbmRMaXN0ZW5lcjogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xyXG4gICAgICBsb25nUHJlc3NUaW1lciAmJiBjbGVhclRpbWVvdXQobG9uZ1ByZXNzVGltZXIpO1xyXG4gICAgICByZW1vdmVUb3VjaE1vdmVMaXN0ZW5lciAmJiByZW1vdmVUb3VjaE1vdmVMaXN0ZW5lcigpO1xyXG4gICAgICByZW1vdmVUb3VjRW5kTGlzdGVuZXIgJiYgcmVtb3ZlVG91Y0VuZExpc3RlbmVyKCk7XHJcblxyXG4gICAgICBsb25nUHJlc3NUaW1lciA9IG51bGw7XHJcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcclxuICAgICAgcmVtb3ZlVG91Y0VuZExpc3RlbmVyID0gbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Ub3VjaFN0YXJ0ID0gKGU6IGFueSkgPT4ge1xyXG4gICAgICBsb25nUHJlc3NUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNsZWFudXAoKTtcclxuICAgICAgICBoYW5kbGVFdmVudExpc3RlbmVyKGUpO1xyXG4gICAgICB9LCB0aGlzLmxvbmdQcmVzc1RocmVzaG9sZCk7XHJcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCAoKSA9PiBjbGVhbnVwKCkpO1xyXG4gICAgICByZW1vdmVUb3VjRW5kTGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT4gY2xlYW51cCgpKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlVG91Y2hTdGFydExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgb25Ub3VjaFN0YXJ0KTtcclxuXHJcbiAgICBlICYmIG9uVG91Y2hTdGFydChlKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBjbGVhbnVwKCk7XHJcbiAgICAgIHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lcigpO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBvbk1vdmVMaXN0ZW5lciA9IChlOiBhbnkpID0+IHtcclxuICAgIGlmICghdGhpcy5pbml0aWFsRXZlbnREYXRhKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgeyB4OiBpbml0WCwgeTogaW5pdFkgfSA9IHRoaXMuaW5pdGlhbEV2ZW50RGF0YTtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRFdmVudENvb3JkcyhlKTtcclxuICAgIGNvbnN0IG9yaWdTZWxlY3Rpbmc6IGJvb2xlYW4gPSB0aGlzLnNlbGVjdGluZyxcclxuICAgICAgZGlzdGFuY2VGcm9tSW5pdFhUb1g6IG51bWJlciA9IE1hdGguYWJzKGluaXRYIC0geCksXHJcbiAgICAgIGRpc3RhbmNlRnJvbUluaXRZVG9ZOiBudW1iZXIgPSBNYXRoLmFicyhpbml0WSAtIHkpLFxyXG4gICAgICBjbGljayA9IHRoaXMuaXNDbGljayh4LCB5KTtcclxuXHJcbiAgICAvLyBQcmV2ZW50IGVtaXR0aW5nIHNlbGVjdFN0YXJ0IGV2ZW50IHVudGlsIG1vdXNlIGlzIG1vdmVkLlxyXG4gICAgLy8gaW4gQ2hyb21lIG9uIFdpbmRvd3MsIG1vdXNlTW92ZSBldmVudCBtYXkgYmUgZmlyZWQganVzdCBhZnRlciBtb3VzZURvd24gZXZlbnQuXHJcbiAgICBpZiAodGhpcy5pc0NsaWNrKHgsIHkpICYmICFvcmlnU2VsZWN0aW5nICYmICEoZGlzdGFuY2VGcm9tSW5pdFhUb1ggfHwgZGlzdGFuY2VGcm9tSW5pdFlUb1kpKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGFmdGVyWDogbnVtYmVyID0geCAtIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGU7XHJcbiAgICBsZXQgYWZ0ZXJZOiBudW1iZXIgPSB5IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5ncmlkTW92ZW1lbnQpIHtcclxuICAgICAgYWZ0ZXJYID0gdGhpcy5jYWxjR3JpZE1vdmVtZW50KGFmdGVyWCk7XHJcbiAgICAgIGFmdGVyWSA9IHRoaXMuY2FsY0dyaWRNb3ZlbWVudChhZnRlclkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0RXZlbnREYXRhID0geyB4OiBhZnRlclgsIHk6IGFmdGVyWSB9O1xyXG4gICAgdGhpcy5zZWxlY3RpbmcgPSB0cnVlO1xyXG5cclxuICAgICFvcmlnU2VsZWN0aW5nICYmIHRoaXMuZW1pdChFVkVOVF9UWVBFLlNFTEVDVF9TVEFSVCwgeyB4OiBpbml0WCwgeTogaW5pdFkgfSk7XHJcbiAgICAhY2xpY2sgJiYgdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNUSU5HLCB0aGlzLnNlbGVjdEV2ZW50RGF0YSk7XHJcblxyXG4gICAgY29uc3QgeyB0b3VjaCwgZGlyIH0gPSB0aGlzLnRvdWNoRWRnZXMoeCwgeSk7XHJcbiAgICBpZiAodG91Y2gpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZW1pdChFVkVOVF9UWVBFLlRPVUNIX0VER0VTLCB7IC4uLnRoaXMuc2VsZWN0RXZlbnREYXRhLCBkaXIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH07XHJcblxyXG4gIG9uRW5kTGlzdGVuZXIgPSAoZTogYW55KSA9PiB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdGlhbEV2ZW50RGF0YSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMub25EZWxHaG9zdEVsKCk7XHJcblxyXG4gICAgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lciAmJiB0aGlzLnJlbW92ZUtleUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnNlbGVjdGluZyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IGluUm9vdCA9IHRoaXMubm9kZS5jb250YWlucyhlLnRhcmdldCk7XHJcblxyXG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xyXG4gICAgY29uc3QgY2xpY2s6IGJvb2xlYW4gPSB0aGlzLmlzQ2xpY2soeCwgeSk7XHJcblxyXG4gICAgaWYgKGUua2V5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoRVZFTlRfVFlQRS5SRVNFVCwgdGhpcy5zZWxlY3RFdmVudERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjbGljayAmJiBpblJvb3QpIHJldHVybiB0aGlzLm9uQ2xpY2tMaXN0ZW5lcihlKTtcclxuXHJcbiAgICBpZiAoIWNsaWNrKSByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNULCB0aGlzLnNlbGVjdEV2ZW50RGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgb25DbGlja0xpc3RlbmVyID0gKGU6IGFueSkgPT4ge1xyXG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xyXG4gICAgY29uc3Qgbm93OiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIGlmICh0aGlzLmxhc3RDbGlja0RhdGEgJiYgbm93IC0gdGhpcy5sYXN0Q2xpY2tEYXRhIDw9IHRoaXMuY2xpY2tJbnRlcnZhbCkge1xyXG4gICAgICB0aGlzLmxhc3RDbGlja0RhdGEgPSBudWxsO1xyXG4gICAgICByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuREJfQ0xJQ0ssIHsgeCwgeSB9KTtcclxuICAgIH1cclxuICAgIHRoaXMubGFzdENsaWNrRGF0YSA9IG5vdztcclxuICAgIHJldHVybiB0aGlzLmVtaXQoRVZFTlRfVFlQRS5DTElDSywgeyB4LCB5IH0pO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgZ2V0RXZlbnRDb29yZHMgPSAoZTogYW55KTogRXZlbnREYXRhID0+IHtcclxuICAgIGNvbnN0IGNvb3JkczogRXZlbnREYXRhID0ge1xyXG4gICAgICBpc1RvdWNoOiBmYWxzZSxcclxuICAgICAgeDogZS5wYWdlWCxcclxuICAgICAgeTogZS5wYWdlWSxcclxuICAgIH07XHJcbiAgICAvKiBpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGgpIHtcclxuICAgICAgY29vcmRzLmlzVG91Y2ggPSB0cnVlO1xyXG4gICAgICBjb29yZHMueCA9IGUudG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgY29vcmRzLnkgPSBlLnRvdWNoZXNbMF0ucGFnZVk7XHJcbiAgICB9ICovXHJcblxyXG4gICAgLyogdHJ5IG5ldyB3YXkgPSkpICovXHJcbiAgICBlLnRvdWNoZXMgJiZcclxuICAgICAgZS50b3VjaGVzLmxlbmd0aCAmJlxyXG4gICAgICAoKGNvb3Jkcy5pc1RvdWNoID0gdHJ1ZSksIChjb29yZHMueCA9IGUudG91Y2hlc1swXS5wYWdlWCksIChjb29yZHMueSA9IGUudG91Y2hlc1swXS5wYWdlWSkpO1xyXG4gICAgcmV0dXJuIGNvb3JkcztcclxuICB9O1xyXG5cclxuICBpc0NsaWNrID0gKGN1cnJYOiBudW1iZXIsIGN1cnJZOiBudW1iZXIpOiBib29sZWFuID0+IHtcclxuICAgIGNvbnN0IHsgaXNUb3VjaCwgeCwgeSB9ID0gdGhpcy5pbml0aWFsRXZlbnREYXRhO1xyXG4gICAgcmV0dXJuICFpc1RvdWNoICYmIE1hdGguYWJzKGN1cnJYIC0geCkgPD0gdGhpcy5jbGlja1RvbGVyYW5jZSAmJiBNYXRoLmFicyhjdXJyWSAtIHkpIDw9IHRoaXMuY2xpY2tUb2xlcmFuY2U7XHJcbiAgfTtcclxuXHJcbiAgdG91Y2hFZGdlcyA9ICh4OiBudW1iZXIsIHk6IG51bWJlcik6IHsgdG91Y2g6IGJvb2xlYW47IGRpcjogc3RyaW5nIHwgbnVsbCB9ID0+IHtcclxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QodGhpcy5ub2RlKTtcclxuXHJcbiAgICBjb25zdCBhZnRlclg6IG51bWJlciA9IHggLSB0aGlzLm9yaWdEaXN0YW5jZUZyb21YVG9Ob2RlO1xyXG4gICAgY29uc3QgYWZ0ZXJZOiBudW1iZXIgPSB5IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTtcclxuXHJcbiAgICBpZiAoYWZ0ZXJYIDwgMCkge1xyXG4gICAgICByZXR1cm4geyB0b3VjaDogdHJ1ZSwgZGlyOiBESVJFQ1RJT04uTEVGVCB9O1xyXG4gICAgfVxyXG4gICAgaWYgKGFmdGVyWCArIHdpZHRoID4gdGhpcy5jdXJyZW50V2luZG93V2lkdGgpIHtcclxuICAgICAgcmV0dXJuIHsgdG91Y2g6IHRydWUsIGRpcjogRElSRUNUSU9OLlJJR0hUIH07XHJcbiAgICB9XHJcbiAgICBpZiAoYWZ0ZXJZIDwgMCkge1xyXG4gICAgICByZXR1cm4geyB0b3VjaDogdHJ1ZSwgZGlyOiBESVJFQ1RJT04uVE9QIH07XHJcbiAgICB9XHJcbiAgICBpZiAoYWZ0ZXJZICsgaGVpZ2h0ID4gdGhpcy5jdXJyZW50V2luZG93SGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiB7IHRvdWNoOiB0cnVlLCBkaXI6IERJUkVDVElPTi5CT1RUT00gfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7IHRvdWNoOiBmYWxzZSwgZGlyOiBudWxsIH07XHJcbiAgfTtcclxuXHJcbiAgY2FsY0dyaWRNb3ZlbWVudCA9IChjdXJyUG9zaXRpb246IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoY3VyclBvc2l0aW9uIC8gdGhpcy5ncmlkTW92ZW1lbnQpICogdGhpcy5ncmlkTW92ZW1lbnQ7XHJcbiAgfTtcclxuICAvKiBoYW5kbGluZyBldmVudCAqL1xyXG5cclxuICAvKiBET00gbWFuaXB1bGF0aW9uICovXHJcbiAgb25DcmVhdGVHaG9zdEVsID0gKG5vZGU6IEVsZW1lbnQpID0+IHtcclxuICAgIC8vIGNyZWF0ZSBnaG9zdCBlbFxyXG4gICAgaWYgKHRoaXMuZ2hvc3QgJiYgdGhpcy5naG9zdC5lbmFibGUpIHtcclxuICAgICAgY29uc3QgZ2hvc3Q6IE5vZGUgPSBub2RlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgKGdob3N0IGFzIEhUTUxFbGVtZW50KS5pZCA9IFwicGUtZ2hvc3RcIjtcclxuICAgICAgaWYgKHRoaXMuZ2hvc3Quc3R5bGUpIHtcclxuICAgICAgICBmb3IgKGxldCBzIGluIHRoaXMuZ2hvc3Quc3R5bGUpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmdob3N0LnN0eWxlW3NdKSB7XHJcbiAgICAgICAgICAgIChnaG9zdCBhcyBIVE1MRWxlbWVudCkuc3R5bGVbc10gPSB0aGlzLmdob3N0LnN0eWxlW3NdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmVtaXQoRVZFTlRfVFlQRS5CRUZPUkVfQ1JFQVRFX0dIT1NULCBnaG9zdCk7XHJcbiAgICAgIHRoaXMuYm9keUVsLmluc2VydEJlZm9yZShnaG9zdCwgbm9kZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgb25EZWxHaG9zdEVsID0gKCkgPT4gdGhpcy5naG9zdCAmJiB0aGlzLmdob3N0LmVuYWJsZSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlLWdob3N0XCIpLnJlbW92ZSgpO1xyXG5cclxuICAvKiBET00gbWFuaXB1bGF0aW9uICovXHJcblxyXG4gIC8qIEluc3BpcmUgYnkgRXZlbnRFbWlpdGVyLCB0dXJuc291dCBpdCdzIFB1YlN1YiBwYXR0ZXJuICovXHJcbiAgb24gPSAodHlwZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbik6IHsgb2ZmOiBGdW5jdGlvbiB9ID0+IHtcclxuICAgIGxldCBpZHg6IG51bWJlciA9ICh0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCAodGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXSkpLnB1c2goaGFuZGxlcikgLSAxO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb2ZmKCkge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBlbWl0ID0gKHR5cGU6IHN0cmluZywgLi4uYXJnczogYW55KTogdm9pZCA9PiB7XHJcbiAgICAodGhpcy5saXN0ZW5lcnNbdHlwZV0gfHwgW10pLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgIGZuKC4uLmFyZ3MpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuICAvKiBJbnNwaXJlIGJ5IEV2ZW50RW1paXRlciwgdHVybnNvdXQgaXQncyBQdWJTdWIgcGF0dGVybiAqL1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFBvaW50RW1pdHRlcjtcclxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTZCQTtBQStCQTtBQUFBO0FBQUE7QUE5QkE7QUFDQTtBQUVBO0FBR0E7QUF1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQW1CQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQWlSQTtBQUFBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]).default}));