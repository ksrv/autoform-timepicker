
import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { moment }   from 'meteor/momentjs:moment';

AutoForm.valueConverters.timeToTimeString = function (val) {
    if (!val instanceof Date) return val;

    return [val.getHours(), val.getMinutes(), val.getSeconds()]
        .map((t) => `00${t}`.slice(-2))
        .join(':');
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
        let normalize = (o) => AutoForm.valueConverters.timeToNormalizedTime(o);
        let def;
        let value;
        if (typeof atts.min == 'undefined') atts.min = '00:00:00';
        if (typeof atts.max == 'undefined') atts.max = '23:59:59';
        if (!context.value) context.value = '00:00:00';

        context.value = normalize(context.value);
        atts.min = normalize(atts.min);
        atts.max = normalize(atts.max);

        def = { 
            hours:   [...Array(24).keys()].slice(atts.min.getHours(), atts.max.getHours()), 
            minutes: [...Array(60).keys()], 
            seconds: [...Array(60).keys()]
        };

        value = { 
            hours:   context.value.getHours(),
            minutes: context.value.getMinutes(), 
            seconds: context.value.getSeconds(), 
        };

        ['hours', 'minutes', 'seconds'].forEach((name) => {
            if (typeof atts[name] === 'undefined' || atts[name]) {
                atts[name] = atts[name] || def[name];
                atts[name] = atts[name].map((t) => {
                    let option = { value: parseInt(t), label: `00${t}`.slice(-2) };
                    if (option.value == value[name]) {
                        option.selected = true;
                    }
                    return option;
                });
                atts[name] = { name: name, options: atts[name] };
            }
        });

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