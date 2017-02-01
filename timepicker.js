
import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';


AutoForm.addInputType('ksrv:autoform-timepicker', {
    template: 'ksrvTimepicker',
    valueOut () {
        let hours   = $('select[name=hours]', this).val() || 0;
        let minutes = $('select[name=minutes]', this).val() || 0;
        let seconds = $('select[name=seconds]', this).val() || 0;
        return new Date(0,0,0,hours,minutes,seconds,0);
    },

    contextAdjust (context) {
        let atts = _.clone(context.atts);
        let value = context.value;



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