/* eslint-disable */
import Component from '../../../../../ui-base/component';
import _ from '../../../../../ui-base/_';
import template from './index.html';

import { deepCopy, scrollTop, firstUpperCase } from '../../util';

const prefixCls = 'ivu-time-picker-cells';
const timeParts = ['hours', 'minutes', 'seconds'];

const KLTimeSpinner = Component.extend({
  name: 'kl-time-spinner',
  template,
  config() {
    _.extend(this.data, {
      disabledHours: [],
      disabledMinutes: [],
      disabledSeconds: [],
      hideDisabledOptions: false,
      hours: NaN,
      minutes: NaN,
      seconds: NaN,
      showSeconds: true,
      steps: [],

      prefixCls,
      compiled: false,
      focusedColumn: -1, // which column inside the picker
      focusedTime: [0, 0, 0], // the values array into [hh, mm, ss]
    });

    this.data.spinerSteps = [1, 1, 1].map((one, i) => Math.abs(this.data.steps[i]) || one);

    this.supr();
  },
  init() {
    this.supr();
    this.data.compiled = true;

    this.hoursList();
    this.minutesList();
    this.secondsList();
  },
  /**
   * 依赖的外部值（这些值变化需要重新更新hourList）：
   * spinerSteps、
   * focusedColumn、
   * focusedTime、
   * disabledHours: 设置不可点击的时间
   * hideDisabledOptions: 隐藏不可点击的选项————只会通过外部传入，内部不会改变
   * hours: value
   */
  hoursList() {
    const store = this.data;

    const hours = [];
    const step = store.spinerSteps[0];
    const focusedHour = store.focusedColumn === 0 && store.focusedTime[0];
    const hour_tmpl = {
      text: 0,
      selected: false,
      disabled: false,
      hide: false,
    };

    for (let i = 0; i < 24; i += step) {
      const hour = deepCopy(hour_tmpl);
      hour.text = i;
      hour.focused = i === focusedHour;

      if (store.disabledHours.length && store.disabledHours.indexOf(i) > -1) {
        hour.disabled = true;
        if (store.hideDisabledOptions) hour.hide = true;
      }
      if (store.hours === i) hour.selected = true;
      hours.push(hour);
    }
    this.data.hoursList = hours;
    return hours;
  },
  /**
   * 依赖的外部值（这些值变化需要重新更新hourList）：
   * spinerSteps、
   * focusedColumn、
   * focusedTime、
   * disabledMinutes: 设置不可点击的时间
   * hideDisabledOptions: 隐藏不可点击的选项————只会通过外部传入，内部不会改变
   * minutes: value
   */
  minutesList() {
    const store = this.data;

    const minutes = [];
    const step = store.spinerSteps[1];
    const focusedMinute = store.focusedColumn === 1 && store.focusedTime[1];
    const minute_tmpl = {
      text: 0,
      selected: false,
      disabled: false,
      hide: false,
    };

    for (let i = 0; i < 60; i += step) {
      const minute = deepCopy(minute_tmpl);
      minute.text = i;
      minute.focused = i === focusedMinute;

      if (store.disabledMinutes.length && store.disabledMinutes.indexOf(i) > -1) {
        minute.disabled = true;
        if (store.hideDisabledOptions) minute.hide = true;
      }
      if (store.minutes === i) minute.selected = true;
      minutes.push(minute);
    }
    this.data.minutesList = minutes;
    return minutes;
  },
  /**
   * 依赖的外部值（这些值变化需要重新更新hourList）：
   * spinerSteps、
   * focusedColumn、
   * focusedTime、
   * disabledSeconds: 设置不可点击的时间
   * hideDisabledOptions: 隐藏不可点击的选项————只会通过外部传入，内部不会改变
   * seconds: value
   */
  secondsList() {
    const store = this.data;

    const seconds = [];
    const step = store.spinerSteps[2];
    const focusedMinute = store.focusedColumn === 2 && store.focusedTime[2];
    const second_tmpl = {
      text: 0,
      selected: false,
      disabled: false,
      hide: false,
    };

    for (let i = 0; i < 60; i += step) {
      const second = deepCopy(second_tmpl);
      second.text = i;
      second.focused = i === focusedMinute;

      if (store.disabledSeconds.length && store.disabledSeconds.indexOf(i) > -1) {
        second.disabled = true;
        if (store.hideDisabledOptions) second.hide = true;
      }
      if (store.seconds === i) second.selected = true;
      seconds.push(second);
    }
    this.data.secondsList = seconds;
    return seconds;
  },


  // 初始化的时候滚动到当前选项
  // watch: {
  //   hours(val) {
  //     if (!this.data.compiled) return;
  //     this.scroll('hours', this.data.hoursList.findIndex(obj => obj.text == val));
  //   },
  //   minutes(val) {
  //     if (!this.data.compiled) return;
  //     this.scroll('minutes', this.data.minutesList.findIndex(obj => obj.text == val));
  //   },
  //   seconds(val) {
  //     if (!this.data.compiled) return;
  //     this.scroll('seconds', this.data.secondsList.findIndex(obj => obj.text == val));
  //   },
  //   focusedTime(updated, old) {
  //     timeParts.forEach((part, i) => {
  //       if (updated[i] === old[i] || typeof updated[i] === 'undefined') return;
  //       const valueIndex = this.data[`${part}List`].findIndex(obj => obj.text === updated[i]);
  //       this.scroll(part, valueIndex);
  //     });
  //   },
  // },

  computed: {
    classes() {
      const secondsCls = this.data.showSeconds ? `${prefixCls}-with-seconds` : '';
      return `${prefixCls} ${secondsCls}`;
    },
  },
  getCellCls(cell) {
    const selectedCls = cell.selected ? `${prefixCls}-cell-selected` : '';
    const disabledCls = cell.disabled ? `${prefixCls}-cell-disabled` : '';
    const focusedCls = cell.focused ? `${prefixCls}-cell-focused` : '';

    return `${prefixCls}-cell ${selectedCls} ${disabledCls} ${focusedCls}`;
  },
  chooseValue(values) {
    const changes = timeParts.reduce((obj, part, i) => {
      const value = values[i];
      if (this.data[part] === value) return obj;
      return {
        ...obj,
        [part]: value,
      };
    }, {});
    if (Object.keys(changes).length > 0) {
      this.emitChange(changes);
    }
  },
  /**
   * 选中时、分、秒
   */
  onClick(type, cell) {
    if (cell.disabled) return;
    const data = { [type]: cell.text };
    console.log(data);
    this.emitChange(data);
  },
  emitChange(changes) {
    this.$emit('change', changes);
    this.$emit('pick-click');
  },

  scroll(type, index) {
    const from = this.$refs[type].scrollTop;
    const to = 24 * this.data.getScrollIndex(type, index);
    scrollTop(this.$refs[type], from, to, 500);
  },
  getScrollIndex(type, index) {
    const Type = firstUpperCase(type);
    const disabled = this.data[`disabled${Type}`];
    if (disabled.length && this.data.hideDisabledOptions) {
      let _count = 0;
      disabled.forEach(item => item <= index ? _count++ : '');
      index -= _count;
    }
    return index;
  },
  updateScroll() {
    setTimeout(() => {
      timeParts.forEach((type) => {
        this.$refs[type].scrollTop = 24 * this.data[`${type}List`].findIndex(obj => obj.text == this.data[type]);
      });
    });
    // this.$nextTick(() => {
    //   timeParts.forEach((type) => {
    //     this.$refs[type].scrollTop = 24 * this.data[`${type}List`].findIndex(obj => obj.text == this.data[type]);
    //   });
    // });
  },
  formatTime(text) {
    return text < 10 ? `0${text}` : text;
  },
  updateFocusedTime(col, time) {
    this.data.focusedColumn = col;
    this.data.focusedTime = time.slice();
  },

});

module.exports = KLTimeSpinner;
