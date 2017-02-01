Package.describe({
  name:     'ksrv:autoform-timepicker',
  version:  '0.0.2',
  summary:  'Meteor autoform simple timepicker field as one (two, three) select.',
  git:      'git@github.com:ksrv/autoform-timepicker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.5.1');
  api.use('ecmascript');
  api.use('templating', ['client']);
  api.use('underscore', ['client']);
  api.use('aldeed:autoform@5.8.1');
  api.use('momentjs:moment@2.14.4');

  api.addFiles('timepicker.html',  ['client']);
  api.addFiles('timepicker.js',    ['client']);
  api.addFiles('timepicker.css',   ['client']);
});
