
import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { moment }   from 'meteor/momentjs:moment';

AutoForm.valueConverters.timeToTimeString = function (val) {
    return (val instanceof Date) ? moment(val).format('HH:mm:ss') : val;
}

AutoForm.valueConverters.timeToNormalizedTime = function (val) {
    if (typeof val == 'string') {
        val = val.split(':');
        // '09:00' > '09:00:00'
        if (val.length = 2) val.push('00');
        val = new Date(0, 0, 0, parseInt(val[0]), parseInt(val[1]), parseInt(val[2]), 0);
    }
    return val;
}


AutoForm.addInputType('ksrv:autoform-timepicker', {
    template: 'ksrvTimepicker',
    valueOut () {
        let hours   = $('select[name=hours]', this).val() || 0;
        let minutes = $('select[name=minutes]', this).val() || 0;
        let seconds = $('select[name=seconds]', this).val() || 0;
        return new Date(0, 0, 0, hours, minutes, seconds, 0);
    },
    valueConverters: {
        "string": AutoForm.valueConverters.timeToTimeString,
        // "stringArray": AutoForm.valueConverters.dateToDateStringUTCArray,
        // "number": AutoForm.valueConverters.dateToNumber,
        // "numberArray": AutoForm.valueConverters.dateToNumberArray,
        // "dateArray": AutoForm.valueConverters.dateToDateArray
    },

    contextAdjust (context) {
        let atts = _.clone(context.atts);
        context.value = AutoForm.valueConverters.timeToNormalizedTime(context.value);

        function createHoursOptions (choice) {
            let option = { value: choice, label: `00${choice}`.slice(-2) };
            if (typeof context.value.getHours === 'function') {
                if (context.value.getHours() == choice) {
                    option.selected = true;
                }
            }
            return option;
        }

        function createHoursOptions (choice) {
            let option = { value: choice, label: `00${choice}`.slice(-2) };
            if (typeof context.value.getHours === 'function') {
                if (context.value.getHours() == choice) {
                    option.selected = true;
                }
            }
            return option;
        }

        function create (name, func) {
            const length = { hours: 24, minutes: 60, seconds: 60 };
            function option (choice) {
                let option = { value: choice, label: `00${choice}`.slice(-2) };
                if (typeof context.value[func] === 'function') {
                    if (context.value[func]() == choice) {
                        option.selected = true;
                    }
                }
                return option;
            }

            if (typeof atts[name] == 'undefined' || atts[name]) {
                let choices = atts[name] || [...Array(length[name]).keys()];
                atts[name] = { name: name, options: choices.map(option) };
            }
        }

        create('hours', 'getHours');
        create('minutes', 'getMinutes');
        create('seconds', 'getSeconds');
        
        if (atts.hours && atts.minutes)   atts.hmdivider = ':';
        if (atts.minutes && atts.seconds) atts.msdivider = ':';

        context.atts = atts;
        return context;
    }
});

Template.ksrvTimepicker.helpers({
    attrs () {
        return {
            class: 'input-group ksrv-timepicker',
            'data-schema-key': this.atts['data-schema-key'],
        }
    }
});

Template.ksrvTimepickerSelect.helpers({
    attrs () {
        let attrs = { value: this.value };
        if (this.selected) attrs.selected = 'selected';
        return attrs
    }
})