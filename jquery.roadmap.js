/*
 * jqRoadmap plugin for jQuery framework - simple guide for heavy road 2 all users & webmasters
 *   (http://brainstorage.me/pushthebutton)
 *
 * Copyright (c) 2013 Evgeny Zacharov
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * $Version: 24/12/2013 r6
 */
(function ($) {  
    $.Roadmap = $.Roadmap || {};
    $.extend($.Roadmap, {
        extend: function (methods) {
            $.extend($.fn.Roadmap, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    });

    $.fn.Roadmap = function (options) {
        var options = $.extend({
            onInit: null,
            allowJump: true,
            voyagerSpeed : 300,
            voyagerPosition: 0,
            checkpoints: [],
            onloadEvent: null,
            checkpointClickEvent: null,
            ckeckpointNext: null,
            checkpointPrev: null,
            width: 400,            
        }, options);

        var $roadmap = $("<div>").addClass("roadmap"),
            $voyager = $("<div>").addClass("voyager"),
            voyagerPosition = options.voyagerPosition,
            voyagerOffset = -1;

        var methods = {
            determineWidth: function ($obj) {
                var r = /[px|em]{2,}/g,
                    w = 0;

                w += parseInt($obj.css("padding-left").replace(r, ""));
                w += parseInt($obj.css("padding-right").replace(r, ""));
                w += parseInt($obj.css("border-left-width").replace(r, ""));
                w += parseInt($obj.css("border-right-width").replace(r, ""));
                w += parseInt($obj.css("margin-left").replace(r, ""));
                w += parseInt($obj.css("margin-right").replace(r, ""));
                return w;
            }
        };

        var make = function () {
            $(this)
                .css("width", options.width)
                .css("display","none");

            var $mark = $("<div>").addClass("mark"),
                $map = $("<div>").addClass("map"),
                $checkpoint = {};               

                
            $(options.checkpoints).each(function (i, o) {
                $checkpoint = $("<div>").addClass("checkpoint");
                $checkpoint
                    .append($("<div>"))
                    .click(function (e) {
                        if ((options.allowJump ||
                            !e.originalEvent) &&
                            $(e.target).closest(".voyager").length == 0) {
                            
                            var ts = $(this),
                                tsOffset = ts.offset(),
                                rmOffset = $roadmap.offset();

                            voyagerPosition = i;
                            if (voyagerOffset < 0) {
                                voyagerOffset = $voyager.offset().left;
                                $voyager.css("left", voyagerOffset);
                            }

                            $voyager.animate({ left: (voyagerOffset + tsOffset.left - rmOffset.left - parseInt($map.css("padding-left"))) }, 400);

                            $("div.mark")
                                .find("div.marklabel").removeClass("active").end()
                                .find("div.marklabel:eq(" + i + ")").addClass("active");

                            /* callback, ����������� ��� �������� ������� ��� */
                            if (o.hndl != null &&
                                typeof (o.hndl) === "function") {
                                o.hndl(voyagerPosition);
                            }
                        }
                    });

                $map.append($checkpoint);

                if (i < options.checkpoints.length - 1) {
                    $map.append($("<div>").addClass("road"))
                    $mark
                        .append($("<div>").addClass("marklabel").html(o.text))
                        .append($("<div>").addClass("road"));
                }
                else {
                    $map.append($("<div>").addClass("clear"));
                    $mark.append($("<div>").addClass("marklabel").html(o.text))
                }
            });

            /* �������� ��� ��������� �������� �� ��������*/
            $roadmap
                .append($map)
                .append($mark); 

            $(this).append($roadmap);
            
            /* ����������� ����� ������� */
            var roadLength = 0,
                checkpointsTotalLength = 0;

            checkpointsTotalLength += methods.determineWidth($checkpoint.find("div"));
            checkpointsTotalLength += methods.determineWidth($checkpoint);

            roadLength = Math.floor((options.width - checkpointsTotalLength * 4) / 3);
            roadLength -= methods.determineWidth($map);
            roadLength -= methods.determineWidth($(".road", $map));
            
            /* ������������ �� ��������� */
            $map
                .find(".road").width(roadLength).end()
                .find(".checkpoint").eq(voyagerPosition).prepend($voyager).end();

            $mark
                .find(".marklabel:eq(" + voyagerPosition + ")").addClass("active").end()
                .find(".marklabel").width(checkpointsTotalLength).end()
                .find(".road").width(roadLength).end();   

            /* 
                onInit handler, ��������� ���
                ��� ������ � ����������� �������
            */
            if (options.onInit != null &&
                typeof (options.onInit) === "function") {
                options.onInit();
            }

            $(this).show();
            $map.find(".checkpoint").eq(voyagerPosition).trigger("click");
        };


        $.Roadmap.extend({
            CurrentPosition: function () {
                return voyagerPosition;
            },
            MoveNext: function () {

                if (voyagerPosition + 1 < options.checkpoints.length) {
                    ++voyagerPosition;

                    $("div.roadmap .checkpoint:eq(" + voyagerPosition + ")").trigger("click");

                    if (typeof (options.ckeckpointNext) === "function") {
                        options.ckeckpointNext(voyagerPosition);
                    }                    
                }
            },
            MovePrev: function () {

                if (voyagerPosition - 1 >= 0) {
                    --voyagerPosition;

                    $("div.roadmap .checkpoint:eq(" + voyagerPosition + ")").trigger("click");

                    if (typeof (options.ckeckpointPrev) === "function") {
                        options.ckeckpointPrev(voyagerPosition);
                    }
                }
            }
        });

        return this.each(make);
    };

})(jQuery);