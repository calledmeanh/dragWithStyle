!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.PointEmitter=t():n.PointEmitter=t()}(this,(()=>(()=>{"use strict";var __webpack_modules__={465:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar EVENT_TYPE;\n(function (EVENT_TYPE) {\n    EVENT_TYPE["BEFORE_SELECT"] = "BEFORE_SELECT";\n    EVENT_TYPE["SELECT_START"] = "SELECT_START";\n    EVENT_TYPE["SELECTING"] = "SELECTING";\n    EVENT_TYPE["SELECT"] = "SELECT";\n    EVENT_TYPE["CLICK"] = "CLICK";\n    EVENT_TYPE["DB_CLICK"] = "DB_CLICK";\n    EVENT_TYPE["TOUCH_EDGES"] = "TOUCH_EDGES";\n    EVENT_TYPE["BEFORE_CREATE_GHOST"] = "BEFORE_CREATE_GHOST";\n    EVENT_TYPE["RESET"] = "RESET";\n})(EVENT_TYPE || (EVENT_TYPE = {}));\nvar DIRECTION;\n(function (DIRECTION) {\n    DIRECTION["TOP"] = "TOP";\n    DIRECTION["RIGHT"] = "RIGHT";\n    DIRECTION["BOTTOM"] = "BOTTOM";\n    DIRECTION["LEFT"] = "LEFT";\n})(DIRECTION || (DIRECTION = {}));\nvar PointEmitter = /** @class */ (function () {\n    function PointEmitter(node, _a) {\n        var _b = _a === void 0 ? {} : _a, _c = _b.longPressThreshold, longPressThreshold = _c === void 0 ? 250 : _c, _d = _b.gridMovement, gridMovement = _d === void 0 ? 0 : _d, _e = _b.saveMouseCoords, saveMouseCoords = _e === void 0 ? false : _e, _f = _b.ghost, ghost = _f === void 0 ? { enable: false } : _f;\n        var _this = this;\n        this.clickTolerance = 5;\n        this.clickInterval = 250;\n        this.currentWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;\n        this.currentWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;\n        this.destroy = function () {\n            _this.longPressThreshold = null;\n            _this.gridMovement = null;\n            _this.saveMouseCoords = null;\n            _this.ghost = null;\n            _this.bodyEl = null;\n            _this.node = null;\n            _this.listeners = Object.create(null);\n            _this.initialEventData = null;\n            _this.origDistanceFromXToNode = null;\n            _this.origDistanceFromYToNode = null;\n            _this.selecting = null;\n            _this.selectEventData = null;\n            _this.lastClickData = null;\n            _this.removeInitialEventListener && _this.removeInitialEventListener();\n            _this.removeMoveListener && _this.removeMoveListener();\n            _this.removeEndListener && _this.removeEndListener();\n            _this.removeKeyListener && _this.removeKeyListener();\n            _this.removeTouchMoveWindowListener && _this.removeTouchMoveWindowListener();\n        };\n        /* getter setter */\n        /* wrapper for add event listener */\n        this.listener = function (type, handler, target) {\n            target && target.addEventListener(type, handler, { passive: false });\n            !target && _this.node && _this.node.addEventListener(type, handler, { passive: false });\n            return function () {\n                target && target.removeEventListener(type, handler);\n                !target && _this.node && _this.node.removeEventListener(type, handler);\n            };\n        };\n        /* wrapper for add event listener */\n        /*  */\n        this.getBoundingRect = function (node) {\n            if (!node)\n                return;\n            var nodeBox = node.getBoundingClientRect();\n            return {\n                top: nodeBox.top + window.pageYOffset,\n                left: nodeBox.left + window.pageXOffset,\n                width: nodeBox.width,\n                height: nodeBox.height,\n            };\n        };\n        /*  */\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\n        this.onInitialEventListener = function () {\n            if (!_this.node)\n                return;\n            var removeTouchStartListener = _this.listener("touchstart", function (e) {\n                _this.removeInitialEventListener();\n                _this.removeInitialEventListener = _this.onAddLongPressListener(_this.onHandleEventListener, e);\n            });\n            var removeMouseDownListener = _this.listener("mousedown", function (e) {\n                _this.removeInitialEventListener();\n                _this.onHandleEventListener(e);\n                _this.removeInitialEventListener = _this.listener("mousedown", _this.onHandleEventListener);\n            });\n            _this.removeInitialEventListener = function () {\n                removeTouchStartListener();\n                removeMouseDownListener();\n            };\n        };\n        /* Listen for mousedown & touchstart. When one is received, disabled the other and setup future event base on type */\n        /* handling event */\n        this.onHandleEventListener = function (e) {\n            if (!_this.node)\n                return;\n            var _a = _this.getEventCoords(e), isTouch = _a.isTouch, x = _a.x, y = _a.y;\n            var _b = _this.getBoundingRect(_this.node), top = _b.top, left = _b.left;\n            _this.origDistanceFromYToNode = y - top;\n            _this.origDistanceFromXToNode = x - left;\n            _this.selectEventData = { x: x, y: y };\n            _this.initialEventData = { isTouch: isTouch, x: x, y: y };\n            _this.onCreateGhostEl(_this.node);\n            _this.emit(EVENT_TYPE.BEFORE_SELECT, _this.initialEventData);\n            switch (e.type) {\n                case "touchstart":\n                    _this.removeMoveListener = _this.listener("touchmove", _this.onMoveListener, window);\n                    _this.removeEndListener = _this.listener("touchend", _this.onEndListener, window);\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\n                    break;\n                case "mousedown":\n                    _this.removeMoveListener = _this.listener("mousemove", _this.onMoveListener, window);\n                    _this.removeEndListener = _this.listener("mouseup", _this.onEndListener, window);\n                    _this.removeKeyListener = _this.listener("keydown", _this.onEndListener, window);\n                    break;\n                default:\n                    break;\n            }\n        };\n        /* add long press listener if user touch the screen without moving their finger for 250ms */\n        this.onAddLongPressListener = function (handleEventListener, e) {\n            var longPressTimer = null;\n            var removeTouchMoveListener = null;\n            var removeToucEndListener = null;\n            var cleanup = function () {\n                longPressTimer && clearTimeout(longPressTimer);\n                removeTouchMoveListener && removeTouchMoveListener();\n                removeToucEndListener && removeToucEndListener();\n                longPressTimer = null;\n                removeTouchMoveListener = null;\n                removeToucEndListener = null;\n            };\n            var onTouchStart = function (e) {\n                longPressTimer = setTimeout(function () {\n                    cleanup();\n                    handleEventListener(e);\n                }, _this.longPressThreshold);\n                removeTouchMoveListener = _this.listener("touchmove", function () { return cleanup(); });\n                removeToucEndListener = _this.listener("touchend", function () { return cleanup(); });\n            };\n            var removeTouchStartListener = _this.listener("touchstart", onTouchStart);\n            e && onTouchStart(e);\n            return function () {\n                cleanup();\n                removeTouchStartListener();\n            };\n        };\n        this.onMoveListener = function (e) {\n            if (!_this.initialEventData)\n                return;\n            var _a = _this.initialEventData, initX = _a.x, initY = _a.y;\n            var _b = _this.getEventCoords(e), x = _b.x, y = _b.y;\n            var origSelecting = _this.selecting, distanceFromInitXToX = Math.abs(initX - x), distanceFromInitYToY = Math.abs(initY - y), click = _this.isClick(x, y);\n            // Prevent emitting selectStart event until mouse is moved.\n            // in Chrome on Windows, mouseMove event may be fired just after mouseDown event.\n            if (_this.isClick(x, y) && !origSelecting && !(distanceFromInitXToX || distanceFromInitYToY))\n                return;\n            var afterX = x;\n            var afterY = y;\n            if (_this.saveMouseCoords) {\n                afterX = x - _this.origDistanceFromXToNode;\n                afterY = y - _this.origDistanceFromYToNode;\n            }\n            if (_this.gridMovement) {\n                afterX = _this.calcGridMovement(afterX);\n                afterY = _this.calcGridMovement(afterY);\n            }\n            _this.selectEventData = { x: afterX, y: afterY };\n            _this.selecting = true;\n            !origSelecting && _this.emit(EVENT_TYPE.SELECT_START, { x: initX, y: initY });\n            !click && _this.emit(EVENT_TYPE.SELECTING, _this.selectEventData);\n            var _c = _this.touchEdges(x, y), touch = _c.touch, dir = _c.dir;\n            if (touch) {\n                return _this.emit(EVENT_TYPE.TOUCH_EDGES, __assign(__assign({}, _this.selectEventData), { dir: dir }));\n            }\n            e.preventDefault();\n        };\n        this.onEndListener = function (e) {\n            if (!_this.initialEventData)\n                return;\n            _this.onDelGhostEl();\n            _this.removeMoveListener && _this.removeMoveListener();\n            _this.removeEndListener && _this.removeEndListener();\n            _this.removeKeyListener && _this.removeKeyListener();\n            _this.selecting = false;\n            var inRoot = _this.node.contains(e.target);\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\n            var click = _this.isClick(x, y);\n            if (e.key) {\n                return _this.emit(EVENT_TYPE.RESET, _this.selectEventData);\n            }\n            if (click && inRoot)\n                return _this.onClickListener(e);\n            if (!click)\n                return _this.emit(EVENT_TYPE.SELECT, _this.selectEventData);\n        };\n        this.onClickListener = function (e) {\n            var _a = _this.getEventCoords(e), x = _a.x, y = _a.y;\n            var now = new Date().getTime();\n            if (_this.lastClickData && now - _this.lastClickData <= _this.clickInterval) {\n                _this.lastClickData = null;\n                return _this.emit(EVENT_TYPE.DB_CLICK, { x: x, y: y });\n            }\n            _this.lastClickData = now;\n            return _this.emit(EVENT_TYPE.CLICK, { x: x, y: y });\n        };\n        this.getEventCoords = function (e) {\n            var coords = {\n                isTouch: false,\n                x: e.pageX,\n                y: e.pageY,\n            };\n            /* if (e.touches && e.touches.length) {\n              coords.isTouch = true;\n              coords.x = e.touches[0].pageX;\n              coords.y = e.touches[0].pageY;\n            } */\n            /* try new way =)) */\n            e.touches &&\n                e.touches.length &&\n                ((coords.isTouch = true), (coords.x = e.touches[0].pageX), (coords.y = e.touches[0].pageY));\n            return coords;\n        };\n        this.isClick = function (currX, currY) {\n            var _a = _this.initialEventData, isTouch = _a.isTouch, x = _a.x, y = _a.y;\n            return !isTouch && Math.abs(currX - x) <= _this.clickTolerance && Math.abs(currY - y) <= _this.clickTolerance;\n        };\n        this.touchEdges = function (x, y) {\n            var _a = _this.getBoundingRect(_this.node), width = _a.width, height = _a.height;\n            var afterX = x;\n            var afterY = y;\n            if (_this.saveMouseCoords) {\n                afterX = x - _this.origDistanceFromXToNode;\n                afterY = y - _this.origDistanceFromYToNode;\n            }\n            if (afterX < 0) {\n                return { touch: true, dir: DIRECTION.LEFT };\n            }\n            if (afterX + width > _this.currentWindowWidth) {\n                return { touch: true, dir: DIRECTION.RIGHT };\n            }\n            if (afterY < 0) {\n                return { touch: true, dir: DIRECTION.TOP };\n            }\n            if (afterY + height > _this.currentWindowHeight) {\n                return { touch: true, dir: DIRECTION.BOTTOM };\n            }\n            return { touch: false, dir: null };\n        };\n        this.calcGridMovement = function (currPosition) {\n            return Math.floor(currPosition / _this.gridMovement) * _this.gridMovement;\n        };\n        /* handling event */\n        /* DOM manipulation */\n        this.onCreateGhostEl = function (node) {\n            // create ghost el\n            if (_this.ghost && _this.ghost.enable) {\n                var ghost = node.cloneNode(true);\n                ghost.id = "pe-ghost";\n                if (_this.ghost.style) {\n                    for (var s in _this.ghost.style) {\n                        if (_this.ghost.style[s]) {\n                            ghost.style[s] = _this.ghost.style[s];\n                        }\n                    }\n                }\n                _this.emit(EVENT_TYPE.BEFORE_CREATE_GHOST, ghost);\n                _this.bodyEl.insertBefore(ghost, node);\n            }\n        };\n        this.onDelGhostEl = function () { return _this.ghost && _this.ghost.enable && document.querySelector("#pe-ghost").remove(); };\n        /* DOM manipulation */\n        /* Inspire by EventEmiiter, turnsout it\'s PubSub pattern */\n        this.on = function (type, handler) {\n            var idx = (_this.listeners[type] || (_this.listeners[type] = [])).push(handler) - 1;\n            return {\n                off: function () {\n                    this.listeners[type].splice(idx, 1);\n                },\n            };\n        };\n        this.emit = function (type) {\n            var args = [];\n            for (var _i = 1; _i < arguments.length; _i++) {\n                args[_i - 1] = arguments[_i];\n            }\n            (_this.listeners[type] || []).forEach(function (fn) {\n                fn.apply(void 0, args);\n            });\n        };\n        this.longPressThreshold = longPressThreshold;\n        this.gridMovement = gridMovement;\n        this.saveMouseCoords = saveMouseCoords;\n        this.ghost = ghost;\n        this.bodyEl = document.querySelector("body");\n        this.node = node;\n        this.listeners = Object.create(null);\n        this.selecting = false;\n        // Fixes an iOS 10 bug where scrolling could not be prevented on the window.\n        this.removeTouchMoveWindowListener = this.listener("touchmove", function () { }, window);\n        this.onInitialEventListener();\n    }\n    Object.defineProperty(PointEmitter.prototype, "getNode", {\n        /* getter setter */\n        get: function () {\n            return this.node;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    Object.defineProperty(PointEmitter.prototype, "getListeners", {\n        get: function () {\n            return this.listeners;\n        },\n        enumerable: false,\n        configurable: true\n    });\n    return PointEmitter;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PointEmitter);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNDY1LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE2QkE7QUFnQ0E7QUFFQTtBQUZBO0FBL0JBO0FBQ0E7QUFFQTtBQUdBO0FBOENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFFQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeFVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQTBCQTtBQURBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQTJSQTtBQUFBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Qb2ludEVtaXR0ZXIvLi9zcmMvaW5kZXgudHM/ZmZiNCJdLCJzb3VyY2VzQ29udGVudCI6WyJlbnVtIEVWRU5UX1RZUEUge1xuICBCRUZPUkVfU0VMRUNUID0gXCJCRUZPUkVfU0VMRUNUXCIsXG4gIFNFTEVDVF9TVEFSVCA9IFwiU0VMRUNUX1NUQVJUXCIsXG4gIFNFTEVDVElORyA9IFwiU0VMRUNUSU5HXCIsXG4gIFNFTEVDVCA9IFwiU0VMRUNUXCIsXG4gIENMSUNLID0gXCJDTElDS1wiLFxuICBEQl9DTElDSyA9IFwiREJfQ0xJQ0tcIixcbiAgVE9VQ0hfRURHRVMgPSBcIlRPVUNIX0VER0VTXCIsXG4gIEJFRk9SRV9DUkVBVEVfR0hPU1QgPSBcIkJFRk9SRV9DUkVBVEVfR0hPU1RcIixcbiAgUkVTRVQgPSBcIlJFU0VUXCIsXG59XG5cbmVudW0gRElSRUNUSU9OIHtcbiAgVE9QID0gXCJUT1BcIixcbiAgUklHSFQgPSBcIlJJR0hUXCIsXG4gIEJPVFRPTSA9IFwiQk9UVE9NXCIsXG4gIExFRlQgPSBcIkxFRlRcIixcbn1cblxudHlwZSBQb2ludERhdGEgPSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufTtcblxudHlwZSBFZGdlRGF0YSA9IFBvaW50RGF0YSAmIHtcbiAgZGlyOiBESVJFQ1RJT047XG59O1xuXG50eXBlIEV2ZW50RGF0YSA9IFBvaW50RGF0YSAmIHtcbiAgaXNUb3VjaDogYm9vbGVhbjtcbn07XG5cbnR5cGUgQm94RGF0YSA9IHtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59O1xuXG50eXBlIExpc3RlbmVyRGF0YSA9IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb25bXSB9O1xuXG50eXBlIEdob3N0ID0ge1xuICBlbmFibGU6IGJvb2xlYW47XG4gIHN0eWxlPzogQ1NTU3R5bGVEZWNsYXJhdGlvbjtcbn07XG5cbmNsYXNzIFBvaW50RW1pdHRlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2xpY2tUb2xlcmFuY2U6IG51bWJlciA9IDU7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2xpY2tJbnRlcnZhbDogbnVtYmVyID0gMjUwO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY3VycmVudFdpbmRvd1dpZHRoOiBudW1iZXIgPVxuICAgIHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY3VycmVudFdpbmRvd0hlaWdodDogbnVtYmVyID1cbiAgICB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcblxuICBwcml2YXRlIGxvbmdQcmVzc1RocmVzaG9sZDogbnVtYmVyIHwgbnVsbDtcbiAgcHJpdmF0ZSBncmlkTW92ZW1lbnQ6IG51bWJlciB8IG51bGw7XG4gIHByaXZhdGUgc2F2ZU1vdXNlQ29vcmRzOiBib29sZWFuIHwgbnVsbDtcbiAgcHJpdmF0ZSBnaG9zdDogR2hvc3QgfCBudWxsO1xuXG4gIHByaXZhdGUgYm9keUVsOiBIVE1MQm9keUVsZW1lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgbm9kZTogRWxlbWVudCB8IG51bGw7XG4gIHByaXZhdGUgbGlzdGVuZXJzOiBMaXN0ZW5lckRhdGE7XG4gIHByaXZhdGUgaW5pdGlhbEV2ZW50RGF0YTogRXZlbnREYXRhIHwgbnVsbDtcbiAgcHJpdmF0ZSBvcmlnRGlzdGFuY2VGcm9tWFRvTm9kZTogbnVtYmVyIHwgbnVsbDtcbiAgcHJpdmF0ZSBvcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTogbnVtYmVyIHwgbnVsbDtcbiAgcHJpdmF0ZSBzZWxlY3Rpbmc6IGJvb2xlYW4gfCBudWxsO1xuICBwcml2YXRlIHNlbGVjdEV2ZW50RGF0YTogUG9pbnREYXRhIHwgbnVsbDsgLy8gc2F2ZSBjdXJyWCAmIGN1cnJZIGZvciBTRUxFQ1RJTkcgJiBTRUxFQ1QgdHlwZSBjYXVzZSBcInRvdWNoRW5kXCIgZG9lc24ndCBoYXZlIFwicGFnZVgsIHBhZ2VZXCJcbiAgcHJpdmF0ZSBsYXN0Q2xpY2tEYXRhOiBudW1iZXIgfCBudWxsOyAvLyBzYXZlIGxhc3QgY2xpY2sgdG8gY29tcGFyZSB3aXRoIGxhdGVzdCBjbGljayBmb3IgREJfQ0xJQ0sgdHlwZVxuXG4gIHByaXZhdGUgcmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXI6IEZ1bmN0aW9uO1xuICBwcml2YXRlIHJlbW92ZU1vdmVMaXN0ZW5lcjogRnVuY3Rpb247XG4gIHByaXZhdGUgcmVtb3ZlRW5kTGlzdGVuZXI6IEZ1bmN0aW9uO1xuICBwcml2YXRlIHJlbW92ZUtleUxpc3RlbmVyOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSByZW1vdmVUb3VjaE1vdmVXaW5kb3dMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgbm9kZTogRWxlbWVudCB8IG51bGwsXG4gICAgeyBsb25nUHJlc3NUaHJlc2hvbGQgPSAyNTAsIGdyaWRNb3ZlbWVudCA9IDAsIHNhdmVNb3VzZUNvb3JkcyA9IGZhbHNlLCBnaG9zdCA9IHsgZW5hYmxlOiBmYWxzZSB9IH0gPSB7fVxuICApIHtcbiAgICB0aGlzLmxvbmdQcmVzc1RocmVzaG9sZCA9IGxvbmdQcmVzc1RocmVzaG9sZDtcbiAgICB0aGlzLmdyaWRNb3ZlbWVudCA9IGdyaWRNb3ZlbWVudDtcbiAgICB0aGlzLnNhdmVNb3VzZUNvb3JkcyA9IHNhdmVNb3VzZUNvb3JkcztcbiAgICB0aGlzLmdob3N0ID0gZ2hvc3Q7XG5cbiAgICB0aGlzLmJvZHlFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5zZWxlY3RpbmcgPSBmYWxzZTtcblxuICAgIC8vIEZpeGVzIGFuIGlPUyAxMCBidWcgd2hlcmUgc2Nyb2xsaW5nIGNvdWxkIG5vdCBiZSBwcmV2ZW50ZWQgb24gdGhlIHdpbmRvdy5cbiAgICB0aGlzLnJlbW92ZVRvdWNoTW92ZVdpbmRvd0xpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCAoKSA9PiB7fSwgd2luZG93KTtcblxuICAgIHRoaXMub25Jbml0aWFsRXZlbnRMaXN0ZW5lcigpO1xuICB9XG5cbiAgZGVzdHJveSA9ICgpID0+IHtcbiAgICB0aGlzLmxvbmdQcmVzc1RocmVzaG9sZCA9IG51bGw7XG4gICAgdGhpcy5ncmlkTW92ZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuc2F2ZU1vdXNlQ29vcmRzID0gbnVsbDtcbiAgICB0aGlzLmdob3N0ID0gbnVsbDtcblxuICAgIHRoaXMuYm9keUVsID0gbnVsbDtcblxuICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuaW5pdGlhbEV2ZW50RGF0YSA9IG51bGw7XG4gICAgdGhpcy5vcmlnRGlzdGFuY2VGcm9tWFRvTm9kZSA9IG51bGw7XG4gICAgdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZSA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RpbmcgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0RXZlbnREYXRhID0gbnVsbDtcbiAgICB0aGlzLmxhc3RDbGlja0RhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciAmJiB0aGlzLnJlbW92ZUluaXRpYWxFdmVudExpc3RlbmVyKCk7XG4gICAgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVNb3ZlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyICYmIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIoKTtcbiAgICB0aGlzLnJlbW92ZUtleUxpc3RlbmVyICYmIHRoaXMucmVtb3ZlS2V5TGlzdGVuZXIoKTtcbiAgICB0aGlzLnJlbW92ZVRvdWNoTW92ZVdpbmRvd0xpc3RlbmVyICYmIHRoaXMucmVtb3ZlVG91Y2hNb3ZlV2luZG93TGlzdGVuZXIoKTtcbiAgfTtcbiAgLyogZ2V0dGVyIHNldHRlciAqL1xuICBnZXQgZ2V0Tm9kZSgpOiBFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5ub2RlO1xuICB9XG5cbiAgZ2V0IGdldExpc3RlbmVycygpOiBMaXN0ZW5lckRhdGEge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVycztcbiAgfVxuICAvKiBnZXR0ZXIgc2V0dGVyICovXG5cbiAgLyogd3JhcHBlciBmb3IgYWRkIGV2ZW50IGxpc3RlbmVyICovXG4gIHByaXZhdGUgbGlzdGVuZXIgPSAodHlwZTogc3RyaW5nLCBoYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0LCB0YXJnZXQ/OiBhbnkpID0+IHtcbiAgICB0YXJnZXQgJiYgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICAhdGFyZ2V0ICYmIHRoaXMubm9kZSAmJiB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRhcmdldCAmJiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyKTtcbiAgICAgICF0YXJnZXQgJiYgdGhpcy5ub2RlICYmIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIpO1xuICAgIH07XG4gIH07XG4gIC8qIHdyYXBwZXIgZm9yIGFkZCBldmVudCBsaXN0ZW5lciAqL1xuXG4gIC8qICAqL1xuICBwcml2YXRlIGdldEJvdW5kaW5nUmVjdCA9IChub2RlOiBFbGVtZW50KTogQm94RGF0YSA9PiB7XG4gICAgaWYgKCFub2RlKSByZXR1cm47XG5cbiAgICBjb25zdCBub2RlQm94OiBET01SZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBub2RlQm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgIGxlZnQ6IG5vZGVCb3gubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcbiAgICAgIHdpZHRoOiBub2RlQm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiBub2RlQm94LmhlaWdodCxcbiAgICB9O1xuICB9O1xuICAvKiAgKi9cblxuICAvKiBMaXN0ZW4gZm9yIG1vdXNlZG93biAmIHRvdWNoc3RhcnQuIFdoZW4gb25lIGlzIHJlY2VpdmVkLCBkaXNhYmxlZCB0aGUgb3RoZXIgYW5kIHNldHVwIGZ1dHVyZSBldmVudCBiYXNlIG9uIHR5cGUgKi9cbiAgcHJpdmF0ZSBvbkluaXRpYWxFdmVudExpc3RlbmVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGlmICghdGhpcy5ub2RlKSByZXR1cm47XG5cbiAgICBjb25zdCByZW1vdmVUb3VjaFN0YXJ0TGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZSkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9IHRoaXMub25BZGRMb25nUHJlc3NMaXN0ZW5lcih0aGlzLm9uSGFuZGxlRXZlbnRMaXN0ZW5lciwgZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZW1vdmVNb3VzZURvd25MaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlSW5pdGlhbEV2ZW50TGlzdGVuZXIoKTtcbiAgICAgIHRoaXMub25IYW5kbGVFdmVudExpc3RlbmVyKGUpO1xuICAgICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbkhhbmRsZUV2ZW50TGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZW1vdmVJbml0aWFsRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgIHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lcigpO1xuICAgICAgcmVtb3ZlTW91c2VEb3duTGlzdGVuZXIoKTtcbiAgICB9O1xuICB9O1xuICAvKiBMaXN0ZW4gZm9yIG1vdXNlZG93biAmIHRvdWNoc3RhcnQuIFdoZW4gb25lIGlzIHJlY2VpdmVkLCBkaXNhYmxlZCB0aGUgb3RoZXIgYW5kIHNldHVwIGZ1dHVyZSBldmVudCBiYXNlIG9uIHR5cGUgKi9cblxuICAvKiBoYW5kbGluZyBldmVudCAqL1xuICBwcml2YXRlIG9uSGFuZGxlRXZlbnRMaXN0ZW5lciA9IChlOiBhbnkpID0+IHtcbiAgICBpZiAoIXRoaXMubm9kZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgeyBpc1RvdWNoLCB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLmdldEJvdW5kaW5nUmVjdCh0aGlzLm5vZGUpO1xuICAgIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVlUb05vZGUgPSB5IC0gdG9wO1xuICAgIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGUgPSB4IC0gbGVmdDtcbiAgICB0aGlzLnNlbGVjdEV2ZW50RGF0YSA9IHsgeCwgeSB9O1xuICAgIHRoaXMuaW5pdGlhbEV2ZW50RGF0YSA9IHsgaXNUb3VjaCwgeCwgeSB9O1xuXG4gICAgdGhpcy5vbkNyZWF0ZUdob3N0RWwodGhpcy5ub2RlKTtcbiAgICB0aGlzLmVtaXQoRVZFTlRfVFlQRS5CRUZPUkVfU0VMRUNULCB0aGlzLmluaXRpYWxFdmVudERhdGEpO1xuXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJ0b3VjaHN0YXJ0XCI6XG4gICAgICAgIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLm9uTW92ZUxpc3RlbmVyLCB3aW5kb3cpO1xuICAgICAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25FbmRMaXN0ZW5lciwgd2luZG93KTtcbiAgICAgICAgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMub25FbmRMaXN0ZW5lciwgd2luZG93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibW91c2Vkb3duXCI6XG4gICAgICAgIHRoaXMucmVtb3ZlTW92ZUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW92ZUxpc3RlbmVyLCB3aW5kb3cpO1xuICAgICAgICB0aGlzLnJlbW92ZUVuZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5vbkVuZExpc3RlbmVyLCB3aW5kb3cpO1xuICAgICAgICB0aGlzLnJlbW92ZUtleUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbkVuZExpc3RlbmVyLCB3aW5kb3cpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICAvKiBhZGQgbG9uZyBwcmVzcyBsaXN0ZW5lciBpZiB1c2VyIHRvdWNoIHRoZSBzY3JlZW4gd2l0aG91dCBtb3ZpbmcgdGhlaXIgZmluZ2VyIGZvciAyNTBtcyAqL1xuICBwcml2YXRlIG9uQWRkTG9uZ1ByZXNzTGlzdGVuZXIgPSAoaGFuZGxlRXZlbnRMaXN0ZW5lcjogRnVuY3Rpb24sIGU6IGFueSkgPT4ge1xuICAgIGxldCBsb25nUHJlc3NUaW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyOiBGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuICAgIGxldCByZW1vdmVUb3VjRW5kTGlzdGVuZXI6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgICAgbG9uZ1ByZXNzVGltZXIgJiYgY2xlYXJUaW1lb3V0KGxvbmdQcmVzc1RpbWVyKTtcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyICYmIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyKCk7XG4gICAgICByZW1vdmVUb3VjRW5kTGlzdGVuZXIgJiYgcmVtb3ZlVG91Y0VuZExpc3RlbmVyKCk7XG5cbiAgICAgIGxvbmdQcmVzc1RpbWVyID0gbnVsbDtcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgIHJlbW92ZVRvdWNFbmRMaXN0ZW5lciA9IG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uVG91Y2hTdGFydCA9IChlOiBhbnkpID0+IHtcbiAgICAgIGxvbmdQcmVzc1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgaGFuZGxlRXZlbnRMaXN0ZW5lcihlKTtcbiAgICAgIH0sIHRoaXMubG9uZ1ByZXNzVGhyZXNob2xkKTtcbiAgICAgIHJlbW92ZVRvdWNoTW92ZUxpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNobW92ZVwiLCAoKSA9PiBjbGVhbnVwKCkpO1xuICAgICAgcmVtb3ZlVG91Y0VuZExpc3RlbmVyID0gdGhpcy5saXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+IGNsZWFudXAoKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZVRvdWNoU3RhcnRMaXN0ZW5lciA9IHRoaXMubGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIG9uVG91Y2hTdGFydCk7XG5cbiAgICBlICYmIG9uVG91Y2hTdGFydChlKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICByZW1vdmVUb3VjaFN0YXJ0TGlzdGVuZXIoKTtcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgb25Nb3ZlTGlzdGVuZXIgPSAoZTogYW55KSA9PiB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxFdmVudERhdGEpIHJldHVybjtcblxuICAgIGNvbnN0IHsgeDogaW5pdFgsIHk6IGluaXRZIH0gPSB0aGlzLmluaXRpYWxFdmVudERhdGE7XG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xuICAgIGNvbnN0IG9yaWdTZWxlY3Rpbmc6IGJvb2xlYW4gPSB0aGlzLnNlbGVjdGluZyxcbiAgICAgIGRpc3RhbmNlRnJvbUluaXRYVG9YOiBudW1iZXIgPSBNYXRoLmFicyhpbml0WCAtIHgpLFxuICAgICAgZGlzdGFuY2VGcm9tSW5pdFlUb1k6IG51bWJlciA9IE1hdGguYWJzKGluaXRZIC0geSksXG4gICAgICBjbGljayA9IHRoaXMuaXNDbGljayh4LCB5KTtcblxuICAgIC8vIFByZXZlbnQgZW1pdHRpbmcgc2VsZWN0U3RhcnQgZXZlbnQgdW50aWwgbW91c2UgaXMgbW92ZWQuXG4gICAgLy8gaW4gQ2hyb21lIG9uIFdpbmRvd3MsIG1vdXNlTW92ZSBldmVudCBtYXkgYmUgZmlyZWQganVzdCBhZnRlciBtb3VzZURvd24gZXZlbnQuXG4gICAgaWYgKHRoaXMuaXNDbGljayh4LCB5KSAmJiAhb3JpZ1NlbGVjdGluZyAmJiAhKGRpc3RhbmNlRnJvbUluaXRYVG9YIHx8IGRpc3RhbmNlRnJvbUluaXRZVG9ZKSkgcmV0dXJuO1xuXG4gICAgbGV0IGFmdGVyWDogbnVtYmVyID0geDtcbiAgICBsZXQgYWZ0ZXJZOiBudW1iZXIgPSB5O1xuICAgIGlmICh0aGlzLnNhdmVNb3VzZUNvb3Jkcykge1xuICAgICAgYWZ0ZXJYID0geCAtIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGU7XG4gICAgICBhZnRlclkgPSB5IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmlkTW92ZW1lbnQpIHtcbiAgICAgIGFmdGVyWCA9IHRoaXMuY2FsY0dyaWRNb3ZlbWVudChhZnRlclgpO1xuICAgICAgYWZ0ZXJZID0gdGhpcy5jYWxjR3JpZE1vdmVtZW50KGFmdGVyWSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RFdmVudERhdGEgPSB7IHg6IGFmdGVyWCwgeTogYWZ0ZXJZIH07XG4gICAgdGhpcy5zZWxlY3RpbmcgPSB0cnVlO1xuXG4gICAgIW9yaWdTZWxlY3RpbmcgJiYgdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNUX1NUQVJULCB7IHg6IGluaXRYLCB5OiBpbml0WSB9KTtcbiAgICAhY2xpY2sgJiYgdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNUSU5HLCB0aGlzLnNlbGVjdEV2ZW50RGF0YSk7XG5cbiAgICBjb25zdCB7IHRvdWNoLCBkaXIgfSA9IHRoaXMudG91Y2hFZGdlcyh4LCB5KTtcbiAgICBpZiAodG91Y2gpIHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoRVZFTlRfVFlQRS5UT1VDSF9FREdFUywgeyAuLi50aGlzLnNlbGVjdEV2ZW50RGF0YSwgZGlyIH0pO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfTtcblxuICBwcml2YXRlIG9uRW5kTGlzdGVuZXIgPSAoZTogYW55KSA9PiB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxFdmVudERhdGEpIHJldHVybjtcblxuICAgIHRoaXMub25EZWxHaG9zdEVsKCk7XG5cbiAgICB0aGlzLnJlbW92ZU1vdmVMaXN0ZW5lciAmJiB0aGlzLnJlbW92ZU1vdmVMaXN0ZW5lcigpO1xuICAgIHRoaXMucmVtb3ZlRW5kTGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVFbmRMaXN0ZW5lcigpO1xuICAgIHRoaXMucmVtb3ZlS2V5TGlzdGVuZXIgJiYgdGhpcy5yZW1vdmVLZXlMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2VsZWN0aW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBpblJvb3QgPSB0aGlzLm5vZGUuY29udGFpbnMoZS50YXJnZXQpO1xuXG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xuICAgIGNvbnN0IGNsaWNrOiBib29sZWFuID0gdGhpcy5pc0NsaWNrKHgsIHkpO1xuXG4gICAgaWYgKGUua2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuUkVTRVQsIHRoaXMuc2VsZWN0RXZlbnREYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2sgJiYgaW5Sb290KSByZXR1cm4gdGhpcy5vbkNsaWNrTGlzdGVuZXIoZSk7XG5cbiAgICBpZiAoIWNsaWNrKSByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuU0VMRUNULCB0aGlzLnNlbGVjdEV2ZW50RGF0YSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBvbkNsaWNrTGlzdGVuZXIgPSAoZTogYW55KSA9PiB7XG4gICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEV2ZW50Q29vcmRzKGUpO1xuICAgIGNvbnN0IG5vdzogbnVtYmVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHRoaXMubGFzdENsaWNrRGF0YSAmJiBub3cgLSB0aGlzLmxhc3RDbGlja0RhdGEgPD0gdGhpcy5jbGlja0ludGVydmFsKSB7XG4gICAgICB0aGlzLmxhc3RDbGlja0RhdGEgPSBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuZW1pdChFVkVOVF9UWVBFLkRCX0NMSUNLLCB7IHgsIHkgfSk7XG4gICAgfVxuICAgIHRoaXMubGFzdENsaWNrRGF0YSA9IG5vdztcbiAgICByZXR1cm4gdGhpcy5lbWl0KEVWRU5UX1RZUEUuQ0xJQ0ssIHsgeCwgeSB9KTtcbiAgfTtcblxuICBwcml2YXRlIGdldEV2ZW50Q29vcmRzID0gKGU6IGFueSk6IEV2ZW50RGF0YSA9PiB7XG4gICAgY29uc3QgY29vcmRzOiBFdmVudERhdGEgPSB7XG4gICAgICBpc1RvdWNoOiBmYWxzZSxcbiAgICAgIHg6IGUucGFnZVgsXG4gICAgICB5OiBlLnBhZ2VZLFxuICAgIH07XG4gICAgLyogaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICBjb29yZHMuaXNUb3VjaCA9IHRydWU7XG4gICAgICBjb29yZHMueCA9IGUudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGNvb3Jkcy55ID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gKi9cblxuICAgIC8qIHRyeSBuZXcgd2F5ID0pKSAqL1xuICAgIGUudG91Y2hlcyAmJlxuICAgICAgZS50b3VjaGVzLmxlbmd0aCAmJlxuICAgICAgKChjb29yZHMuaXNUb3VjaCA9IHRydWUpLCAoY29vcmRzLnggPSBlLnRvdWNoZXNbMF0ucGFnZVgpLCAoY29vcmRzLnkgPSBlLnRvdWNoZXNbMF0ucGFnZVkpKTtcbiAgICByZXR1cm4gY29vcmRzO1xuICB9O1xuXG4gIHByaXZhdGUgaXNDbGljayA9IChjdXJyWDogbnVtYmVyLCBjdXJyWTogbnVtYmVyKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgeyBpc1RvdWNoLCB4LCB5IH0gPSB0aGlzLmluaXRpYWxFdmVudERhdGE7XG4gICAgcmV0dXJuICFpc1RvdWNoICYmIE1hdGguYWJzKGN1cnJYIC0geCkgPD0gdGhpcy5jbGlja1RvbGVyYW5jZSAmJiBNYXRoLmFicyhjdXJyWSAtIHkpIDw9IHRoaXMuY2xpY2tUb2xlcmFuY2U7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b3VjaEVkZ2VzID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogeyB0b3VjaDogYm9vbGVhbjsgZGlyOiBzdHJpbmcgfCBudWxsIH0gPT4ge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QodGhpcy5ub2RlKTtcblxuICAgIGxldCBhZnRlclg6IG51bWJlciA9IHg7XG4gICAgbGV0IGFmdGVyWTogbnVtYmVyID0geTtcblxuICAgIGlmICh0aGlzLnNhdmVNb3VzZUNvb3Jkcykge1xuICAgICAgYWZ0ZXJYID0geCAtIHRoaXMub3JpZ0Rpc3RhbmNlRnJvbVhUb05vZGU7XG4gICAgICBhZnRlclkgPSB5IC0gdGhpcy5vcmlnRGlzdGFuY2VGcm9tWVRvTm9kZTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJYIDwgMCkge1xuICAgICAgcmV0dXJuIHsgdG91Y2g6IHRydWUsIGRpcjogRElSRUNUSU9OLkxFRlQgfTtcbiAgICB9XG4gICAgaWYgKGFmdGVyWCArIHdpZHRoID4gdGhpcy5jdXJyZW50V2luZG93V2lkdGgpIHtcbiAgICAgIHJldHVybiB7IHRvdWNoOiB0cnVlLCBkaXI6IERJUkVDVElPTi5SSUdIVCB9O1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJZIDwgMCkge1xuICAgICAgcmV0dXJuIHsgdG91Y2g6IHRydWUsIGRpcjogRElSRUNUSU9OLlRPUCB9O1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJZICsgaGVpZ2h0ID4gdGhpcy5jdXJyZW50V2luZG93SGVpZ2h0KSB7XG4gICAgICByZXR1cm4geyB0b3VjaDogdHJ1ZSwgZGlyOiBESVJFQ1RJT04uQk9UVE9NIH07XG4gICAgfVxuICAgIHJldHVybiB7IHRvdWNoOiBmYWxzZSwgZGlyOiBudWxsIH07XG4gIH07XG5cbiAgcHJpdmF0ZSBjYWxjR3JpZE1vdmVtZW50ID0gKGN1cnJQb3NpdGlvbjogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoY3VyclBvc2l0aW9uIC8gdGhpcy5ncmlkTW92ZW1lbnQpICogdGhpcy5ncmlkTW92ZW1lbnQ7XG4gIH07XG4gIC8qIGhhbmRsaW5nIGV2ZW50ICovXG5cbiAgLyogRE9NIG1hbmlwdWxhdGlvbiAqL1xuICBwcml2YXRlIG9uQ3JlYXRlR2hvc3RFbCA9IChub2RlOiBFbGVtZW50KSA9PiB7XG4gICAgLy8gY3JlYXRlIGdob3N0IGVsXG4gICAgaWYgKHRoaXMuZ2hvc3QgJiYgdGhpcy5naG9zdC5lbmFibGUpIHtcbiAgICAgIGNvbnN0IGdob3N0OiBOb2RlID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAoZ2hvc3QgYXMgSFRNTEVsZW1lbnQpLmlkID0gXCJwZS1naG9zdFwiO1xuICAgICAgaWYgKHRoaXMuZ2hvc3Quc3R5bGUpIHtcbiAgICAgICAgZm9yIChsZXQgcyBpbiB0aGlzLmdob3N0LnN0eWxlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuZ2hvc3Quc3R5bGVbc10pIHtcbiAgICAgICAgICAgIChnaG9zdCBhcyBIVE1MRWxlbWVudCkuc3R5bGVbc10gPSB0aGlzLmdob3N0LnN0eWxlW3NdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KEVWRU5UX1RZUEUuQkVGT1JFX0NSRUFURV9HSE9TVCwgZ2hvc3QpO1xuICAgICAgdGhpcy5ib2R5RWwuaW5zZXJ0QmVmb3JlKGdob3N0LCBub2RlKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBvbkRlbEdob3N0RWwgPSAoKSA9PiB0aGlzLmdob3N0ICYmIHRoaXMuZ2hvc3QuZW5hYmxlICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGUtZ2hvc3RcIikucmVtb3ZlKCk7XG4gIC8qIERPTSBtYW5pcHVsYXRpb24gKi9cblxuICAvKiBJbnNwaXJlIGJ5IEV2ZW50RW1paXRlciwgdHVybnNvdXQgaXQncyBQdWJTdWIgcGF0dGVybiAqL1xuICBvbiA9ICh0eXBlOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKTogeyBvZmY6IEZ1bmN0aW9uIH0gPT4ge1xuICAgIGxldCBpZHg6IG51bWJlciA9ICh0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCAodGhpcy5saXN0ZW5lcnNbdHlwZV0gPSBbXSkpLnB1c2goaGFuZGxlcikgLSAxO1xuICAgIHJldHVybiB7XG4gICAgICBvZmYoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnNwbGljZShpZHgsIDEpO1xuICAgICAgfSxcbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgZW1pdCA9ICh0eXBlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueSk6IHZvaWQgPT4ge1xuICAgICh0aGlzLmxpc3RlbmVyc1t0eXBlXSB8fCBbXSkuZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgIGZuKC4uLmFyZ3MpO1xuICAgIH0pO1xuICB9O1xuICAvKiBJbnNwaXJlIGJ5IEV2ZW50RW1paXRlciwgdHVybnNvdXQgaXQncyBQdWJTdWIgcGF0dGVybiAqL1xufVxuZXhwb3J0IGRlZmF1bHQgUG9pbnRFbWl0dGVyO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///465\n')}},__webpack_require__={d:(n,t)=>{for(var e in t)__webpack_require__.o(t,e)&&!__webpack_require__.o(n,e)&&Object.defineProperty(n,e,{enumerable:!0,get:t[e]})},o:(n,t)=>Object.prototype.hasOwnProperty.call(n,t)},__webpack_exports__={};return __webpack_modules__[465](0,__webpack_exports__,__webpack_require__),__webpack_exports__=__webpack_exports__.default,__webpack_exports__})()));