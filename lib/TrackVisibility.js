"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require("lodash.throttle");

var _lodash2 = _interopRequireDefault(_lodash);

var _shallowequal = require("shallowequal");

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global window, document */


var TrackVisibility = function (_Component) {
  _inherits(TrackVisibility, _Component);

  function TrackVisibility(props) {
    _classCallCheck(this, TrackVisibility);

    var _this = _possibleConstructorReturn(this, (TrackVisibility.__proto__ || Object.getPrototypeOf(TrackVisibility)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      isVisible: false
    };
    _this.throttleCb = (0, _lodash2.default)(_this.isComponentVisible, _this.props.throttleInterval);
    _this.unmounted = false;

    props.nodeRef && _this.setNodeRef(props.nodeRef);
    return _this;
  }

  _createClass(TrackVisibility, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.attachListener();
      setTimeout(this.isComponentVisible, 0);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
      this.removeListener();
    }

    /**
     * Only update (call render) if the state has changed or one of the components configured props
     * (something in defaultProps) has been changed. This allows recalculation of visibility on prop
     * change (using componentWillReceiveProps) without vDOM diff'ing by React.
     */

  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.unmounted) {
        return false;
      }

      return !(0, _shallowequal2.default)(this.state, nextState) || !(0, _shallowequal2.default)(this.getOwnProps(this.props), this.getOwnProps(nextProps));
    }

    /**
     * Trigger visibility calculation only when non-own props change
     */

  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _shallowequal2.default)(this.getChildProps(this.props), this.getChildProps(nextProps))) {
        setTimeout(this.isComponentVisible, 0);
      }
    }
  }, {
    key: "attachListener",
    value: function attachListener() {
      window.addEventListener("scroll", this.throttleCb);
      window.addEventListener("resize", this.throttleCb);
    }
  }, {
    key: "removeListener",
    value: function removeListener() {
      window.removeEventListener("scroll", this.throttleCb);
      window.removeEventListener("resize", this.throttleCb);
    }
  }, {
    key: "getOwnProps",
    value: function getOwnProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      var ownProps = {};
      Object.keys(TrackVisibility.defaultProps).forEach(function (key) {
        ownProps[key] = props[key];
      });
      return ownProps;
    }
  }, {
    key: "getChildProps",
    value: function getChildProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      var childProps = {};
      Object.keys(props).forEach(function (key) {
        if (!{}.hasOwnProperty.call(TrackVisibility.defaultProps, key)) {
          childProps[key] = props[key];
        }
      });
      return childProps;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var _this2 = this;

      if (typeof this.props.children === "function") {
        return this.props.children(Object.assign({}, this.getChildProps(), {
          isVisible: this.state.isVisible
        }));
      }

      return _react2.default.Children.map(this.props.children, function (child) {
        return _react2.default.cloneElement(child, Object.assign({}, _this2.getChildProps(), {
          isVisible: _this2.state.isVisible
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          className = _props.className,
          style = _props.style,
          nodeRef = _props.nodeRef;

      var props = Object.assign({}, className !== null && { className: className }, style !== null && { style: style });

      return _react2.default.createElement(
        "div",
        Object.assign({ ref: !nodeRef && this.setNodeRef }, props),
        this.getChildren()
      );
    }
  }]);

  return TrackVisibility;
}(_react.Component);

TrackVisibility.propTypes = {
  /**
   * Define if the visibility need to be tracked once
   */
  once: _propTypes2.default.bool,

  /**
   * Tweak the throttle interval
   * Check https://css-tricks.com/debouncing-throttling-explained-examples/ for more details
   */
  throttleInterval: function throttleInterval(props, propName, component) {
    var currentProp = props[propName];
    if (!Number.isInteger(currentProp) || currentProp < 0) {
      return new Error("The " + propName + " prop you provided to " + component + " is not a valid integer >= 0.");
    }
    return null;
  },

  /**
   * Pass one or more children to track
   */
  children: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element, _propTypes2.default.arrayOf(_propTypes2.default.element)]),
  /**
   * Additional style to apply
   */
  style: _propTypes2.default.object,

  /**
   * Additional className to apply
   */
  className: _propTypes2.default.string,

  /**
   * Define an offset. Can be useful for lazy loading
   */
  offset: _propTypes2.default.number,

  /**
   * Update the visibility state as soon as a part of the tracked component is visible
   */
  partialVisibility: _propTypes2.default.bool,

  /**
   * Exposed for testing but allows node other than internal wrapping <div /> to be tracked
   * for visibility
   */
  nodeRef: _propTypes2.default.object
};
TrackVisibility.defaultProps = {
  once: false,
  throttleInterval: 150,
  children: null,
  style: null,
  className: null,
  offset: 0,
  partialVisibility: false,
  nodeRef: null
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.safeSetState = function () {
    if (_this3.unmounted) {
      return;
    }

    _this3.setState.apply(_this3, arguments);
  };

  this.isVisible = function (_ref, windowWidth, windowHeight) {
    var top = _ref.top,
        left = _ref.left,
        bottom = _ref.bottom,
        right = _ref.right,
        width = _ref.width,
        height = _ref.height;
    var _props2 = _this3.props,
        offset = _props2.offset,
        partialVisibility = _props2.partialVisibility;


    if (top + right + bottom + left === 0) {
      return false;
    }

    var topThreshold = 0 - offset;
    var leftThreshold = 0 - offset;
    var widthCheck = windowWidth + offset;
    var heightCheck = windowHeight + offset;

    return partialVisibility ? top + height >= topThreshold && left + width >= leftThreshold && bottom - height <= heightCheck && right - width <= widthCheck : top >= topThreshold && left >= leftThreshold && bottom <= heightCheck && right <= widthCheck;
  };

  this.isComponentVisible = function () {
    var html = document.documentElement;
    var once = _this3.props.once;

    var boundingClientRect = _this3.nodeRef ? _this3.nodeRef.getBoundingClientRect() : { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
    var windowWidth = window.innerWidth || html.clientWidth;
    var windowHeight = window.innerHeight || html.clientHeight;

    var isVisible = _this3.isVisible(boundingClientRect, windowWidth, windowHeight);

    if (isVisible && once) {
      _this3.removeListener();
    }

    _this3.safeSetState({ isVisible: isVisible });
  };

  this.setNodeRef = function (ref) {
    return _this3.nodeRef = ref;
  };
};

exports.default = TrackVisibility;