import {select, settings, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import HourPicker from './HourPicker.js';
import DatePicker from './DatePicker.js';
import utils from '../utils.js';

export default class Booking {
  constructor(element) {
    this.render(element);
    this.initWidgets();
    this.getData();
  }

  getData() {
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(this.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(this.datePicker.maxDate);


    const params = {
      booking: [
        startDateParam,
        endDateParam,

      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,

      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,

      ],
    };
    // console.log('getData', params);

    const urls = {
      bookings: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    //console.log('getData url',urls);
    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];

        return  Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat ]) {
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });
  }

  initWidgets() {

    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);
    this.dom.hoursAmount.addEventListener('update', () => {
    });
    this.dom.peopleAmount.addEventListener('update', () => {
    });
    this.hourPicker = new HourPicker(this.dom.hourPicker);
    this.datePicker = new DatePicker(this.dom.datePicker);
  }

  render(element) {
    this.dom = {};
    this.dom.wrapper = element;
    this.dom.wrapper.innerHTML = templates.bookingWidget();

    this.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    this.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    this.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
  }
}
