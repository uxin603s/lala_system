angular.module('app',['color.picker','param','cache']).
config(function($provide) {
    $provide.decorator('ColorPickerOptions', function($delegate) {
        var options = angular.copy($delegate);
   
        options.format = 'rgb';
        options.swatchOnly = true;
        options.pos = 'bottom left';
        return options;
    });
});