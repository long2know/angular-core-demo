import { Injectable } from '@angular/core';
declare var Spinner: any;

@Injectable()
export class SpinService {
    private modal_opts: any = {
        lines: 11, // The number of lines to draw
        length: 23, // The length of each line
        width: 8, // The line thickness
        radius: 40, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 9, // The rotation offset
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 50, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    private presets: any = {
        tiny: { lines: 8, length: 2, width: 2, radius: 3 },
        small: { lines: 8, length: 4, width: 3, radius: 5 },
        large: { lines: 10, length: 8, width: 4, radius: 8 }
    }

    constructor() {
    }

    public spin(selector: any, opts: any, color: any, bgColor: any) {
        var that = this;
        if (opts == "modal") opts = that.modal_opts;
        var $elements = $(selector);
        return $elements.each(function () {
            var $this = $(this),
                data = $this.data();

            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
                if (opts == that.modal_opts) {
                    $("#spin_modal_overlay").remove();
                    return;
                }
            }
            if (opts !== false) {
                var spinElem = this;
                if (opts == that.modal_opts) {
                    var backgroundColor = 'background-color:' + (bgColor ? bgColor : 'rgba(0, 0, 0, 0.6)');
                    $('body').append('<div id="spin_modal_overlay" style=\"' + backgroundColor + ';width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:' + (opts.zIndex - 1) + '"/>');
                    spinElem = $("#spin_modal_overlay")[0];
                }

                opts = $.extend({}, that.presets[opts] || opts, { color: color || $this.css('color') });
                data.spinner = new Spinner(opts).spin(spinElem);
            }
        })
    }
}
