(function($) {
    var range_select;
    var date1;
    var date2;
    var date_since;
    var highlight;
    var specdate_active;
    var range_active;
    var dateafter_active;
	var doc_height;
	
    function loadData(obj) {
		return obj.data("drpicker");
    }
	
	function initVars() {
		range_select=null;
		date1=null;
		date2=null;
		date_since=null;
		highlight=null;
		specdate_active=null;
		range_active=null;
		dateafter_active=null;
		doc_height=$(document).height();
		doc_width=$(document).width();
	}

    function storeData(obj,elementsCache) {
		obj.data("drpicker",elementsCache);
    }

    function createMenu(elementsCache,label) {
        elementsCache.menu = $("<div class='dp-menu'></div>");
        var ul = $("<ul></ul>");
		var settings=label.data("dpsettings");
        elementsCache.menu_spec_date = $("<li>Specific Date</li>");
		ul.append(elementsCache.menu_spec_date);
        elementsCache.menu_rage_date = $("<li>Date Range</li>");
		ul.append(elementsCache.menu_rage_date);
        elementsCache.menu_after_date = $("<li>All Dates After</li>");
        ul.append(elementsCache.menu_after_date);
        elementsCache.menu.append(ul);
		elementsCache.container=$("<div class='dp-container dp-hid'></div>");
        elementsCache.container.append(elementsCache.menu);
		
		if (!settings.specificDate) {
			elementsCache.menu_spec_date.hide();
		}
		if (!settings.dateRange) {
			elementsCache.menu_rage_date.hide();
		}
		if (!settings.afterDate) {
			elementsCache.menu_after_date.hide();
		}
    }

    function createPickerView(elementsCache) {
        var btn_container = $("<div class='dp-btn-container' />");

        var buttons = $("<button class='apply' disabled='disabled'>Apply</button>");
        var close_btn = $('<span class="dp-cancel ui-dialog"><a class="ui-dialog-titlebar-close ui-corner-all" href="#" role="button"> <span class="ui-icon ui-icon-closethick">close</span></a></span>');
        // create specific date view
        elementsCache.spec_date_input = $("<input type='text' class='dp-date-display' value='' />");
        elementsCache.cal1 = $("<div></div>");
        var container1 = btn_container.clone();
        container1.append(elementsCache.spec_date_input);
        container1.append(buttons.clone());
        container1.append(close_btn.clone());
        elementsCache.specific_date_view = $("<div class='spec-date-view dp-hid'></div>");
        elementsCache.specific_date_view.append(container1);
        elementsCache.specific_date_view.append(elementsCache.cal1);
        // create date range view
        elementsCache.date_range_input1 = $("<input type='text' class='date1 dp-date-display dp-active' value=''/>");
        var container2 = btn_container.clone();
        var to = $("<span class='dp-date-seperator'>-</span>");
        elementsCache.date_range_input2 = $("<input type='text' class='date2 dp-date-display' value=''/>");
        elementsCache.err_msg = $("<div class='dp-err_msg'>End date must be later than start date!</div>");
        elementsCache.err_msg1= $("<div class='dp-err_msg'>The date must be earlier than today!</div>");
        elementsCache.cal2 = $("<div></div>");
        elementsCache.date_range_view = $("<div class='date-range-view dp-hid'></div>");
        container2.append(elementsCache.date_range_input1);
        container2.append(to);
        container2.append(elementsCache.date_range_input2);
        container2.append(elementsCache.err_msg);
        container2.append(elementsCache.err_msg1);
        container2.append(buttons.clone());
        container2.append(close_btn.clone());
        elementsCache.date_range_view.append(container2);
        elementsCache.date_range_view.append(elementsCache.cal2);
        // create after date view
        var container3 = btn_container.clone();
        elementsCache.after_date_input = $("<input type='text' class='dp-date-display' value=''>");
        elementsCache.after_date_input2 = $("<span class='dp-today-text'>today</span>");
        var until = $("<span class='dp-date-seperator'>-</span>");
        elementsCache.cal3 = $("<div></div>");
        elementsCache.after_date_view = $("<div class='after-date-view dp-hid'></div>");
        container3.append(elementsCache.after_date_input);
        container3.append(until);
        container3.append(elementsCache.after_date_input2);
        container3.append(buttons.clone());
        container3.append(close_btn.clone());
        elementsCache.after_date_view.append(container3);
        elementsCache.after_date_view.append(elementsCache.cal3);
        // glue all the views together and push them to the dom
        elementsCache.picker = $("<div class='pickerView'></div>");
        elementsCache.picker.append(elementsCache.specific_date_view);
        elementsCache.picker.append(elementsCache.date_range_view);
        elementsCache.picker.append(elementsCache.after_date_view);

        elementsCache.container.append(elementsCache.picker)
    }

    function decoration(label) {
        label.addClass('dp-label');
        label.append('<span class="dp-arrow"><span class="dp-down"></span></span>');
    }

    function positionEl(elementsCache) {
        elementsCache.picker.css("left", elementsCache.menu.width());
    }

    function menuSelection(item,elementsCache) {
		if (elementsCache.flipleft) {
			item.parent().find("li").removeClass();
			item.addClass("dp-selected-mirror");
		} else {
			item.parent().find("li").removeClass();
			item.addClass("dp-selected");
		}
    }

    function bindTasks(label, elementsCache) {
        elementsCache.menu_spec_date.bind("click", function() {
            elementsCache.picker.children().hide();
            elementsCache.specific_date_view.show();
			if (elementsCache.flipleft) {
				flipLeftAdjust(elementsCache);
			}
            menuSelection($(this),elementsCache);
        });
        elementsCache.menu_rage_date.bind("click", function() {
            elementsCache.picker.children().hide();
            elementsCache.date_range_view.show();
            elementsCache.cal2.datepicker("refresh");
			if (elementsCache.flipleft) {
				flipLeftAdjust(elementsCache);
			}
            menuSelection($(this),elementsCache);
        });
        elementsCache.menu_after_date.bind("click", function() {
            elementsCache.picker.children().hide();
            elementsCache.cal3.datepicker("refresh");
            elementsCache.after_date_view.show();
			if (elementsCache.flipleft) {
				flipLeftAdjust(elementsCache);
			}
            menuSelection($(this),elementsCache);
        });
        // register enter key for the date inputs
        elementsCache.picker.find(".dp-date-display").keyup(function(e) {
            if (e.keyCode == 13) {
				var $this=$(this);
                $this.blur();
				if (!$this.hasClass("date1")) {
					$this.parent().find(".apply").trigger("click");
				}
            }
        });
        // date range text box click
        elementsCache.date_range_input1.click(function() {
            $(this).addClass("dp-active");
            elementsCache.date_range_input2.removeClass("dp-active");
        });
        elementsCache.date_range_input2.click(function() {
            $(this).addClass("dp-active");
            elementsCache.date_range_input1.removeClass("dp-active");
        });
		//enable apply button when you type
		elementsCache.spec_date_input.one("keydown",function(){
			$(this).parent().find(".apply").removeAttr("disabled");
		});
		elementsCache.date_range_input1.one("keydown",function(){
			$(this).parent().find(".apply").removeAttr("disabled");
		});
		elementsCache.date_range_input2.one("keydown",function(){
			$(this).parent().find(".apply").removeAttr("disabled");
		});
		elementsCache.after_date_input.one("keydown",function(){
			$(this).parent().find(".apply").removeAttr("disabled");
		});
        // bring up the datepicker when click on the div label
        label.bind("click", function() {
            var elementsCache=loadData($(this));
			initVars();
            if (elementsCache.menu.is(":hidden")){
				elementsCache.container.show();
                label.find('.dp-down').removeClass('dp-down').addClass('dp-up');
                range_active = false;
                dateafter_active = false;
                specdate_active=false;
                elementsCache.specific_date_view.find(".ui-state-active").parent().addClass("highlight_history");
				autoSelectConfig(label,elementsCache);
				flipUp(elementsCache);
				flipLeft(elementsCache);
            } else {
                hidePicker(label,elementsCache);
            }
        });
		
		function flipUp(elementsCache) {
			if (!elementsCache.flipup) {
				var h1=doc_height-label.offset().top-label.outerHeight();
				var h2=elementsCache.picker.outerHeight();
				if (h1<h2) {
					var menu_top=label.offset().top-elementsCache.menu.outerHeight() +1;
					var picker_top=label.offset().top-elementsCache.picker.outerHeight() +1;
					elementsCache.menu.offset({top:menu_top});
					elementsCache.picker.offset({top:picker_top});
					elementsCache.flipup=true;
                    elementsCache.container.addClass('dp-flip-up');
				}
			} else {
				flipDown(elementsCache);
			}
		}
		
		function flipDown(elementsCache) {
			if (elementsCache.flipup) {
				var h1=doc_height-label.offset().top-label.outerHeight();
				var h2=elementsCache.picker.outerHeight();
				if (h1>h2) {
					var t=label.offset().top+label.outerHeight();
					elementsCache.menu.offset({top:t});
					elementsCache.picker.offset({top:t});
					elementsCache.flipup=false;
				}
			}
		}
		
		function flipLeft(elementsCache) {
			var l1=doc_width-label.offset().left-label.outerWidth();
			var l2=elementsCache.picker.outerWidth();
			if (l1<l2) {
				var menu_left=label.offset().left-elementsCache.menu.outerWidth()+label.outerWidth();
				var _top=label.offset().top+label.outerHeight();
				var picker_left=label.offset().left-elementsCache.menu.outerWidth()-elementsCache.picker.outerWidth()+label.outerWidth();
				if (elementsCache.flipup) {
					elementsCache.menu.offset({left:menu_left});
					elementsCache.picker.offset({left:picker_left});
				} else {
					elementsCache.menu.offset({left:menu_left,top:_top});
					elementsCache.picker.offset({left:picker_left,top:_top});
				}
				elementsCache.flipleft=true;
                elementsCache.container.addClass('dp-flip-left');
			}
		}
		
		function flipLeftAdjust(elementsCache) {
			if (elementsCache.flipleft) {
				var l=label.offset().left+label.outerWidth()-elementsCache.menu.outerWidth()-elementsCache.picker.outerWidth();
				elementsCache.picker.offset({left:l});
			}
		}
				// automatically select the date on the calendar according to the date exist
		// on the div. If no date available, the current date will be selected
		function autoSelectConfig(label,elementsCache) {
			var input=label.find("input:first");
			var label_date1=$.datepicker.parseDate('mm/dd/yy',input.val());
			var label_date2=$.datepicker.parseDate('mm/dd/yy',input.next().val());
			var maxDate=label.data("dpsettings").maxDate;
			var dateSet={date1:label_date1,date2:label_date2};
			if (dateSet.date1>dateSet.date2) {
				elementsCache.container.hide();
				$.error("Error from date range picker: The start date cannot be later than the end date!");
			}
			if (dateSet.date2>maxDate) {
				elementsCache.container.hide();
				$.error("Error from date range picker: The end date cannot be later than the max date!");
			}
			// jump to the tab
			elementsCache.picker.children().hide();
			//specific date, if both dates are the same
			if (dateSet.date1.toLocaleDateString() == dateSet.date2.toLocaleDateString()) {
				autoSelect(dateSet,elementsCache, 1);
				elementsCache.picker.children().hide();
				range_active = false;
				dateafter_active = false;
				elementsCache.specific_date_view.show();
				menuSelection(elementsCache.menu_spec_date,elementsCache);
				//reset other views
				clearDateRange(elementsCache);
				elementsCache.cal2.datepicker("setDate",dateSet.date1);
				clearDateAfter(elementsCache);
				elementsCache.cal3.datepicker("setDate",dateSet.date1);
			} else if (dateSet.date2.toLocaleDateString() == new Date().toLocaleDateString()) {
				//date after
				autoSelect(dateSet,elementsCache, 3);
				elementsCache.picker.children().hide();
				range_active = false;
				dateafter_active = false;	
				elementsCache.cal3.datepicker("refresh");
				elementsCache.after_date_view.show();
				menuSelection(elementsCache.menu_after_date,elementsCache);
				//reset other views
				clearSpecificDate(elementsCache);
				elementsCache.cal1.datepicker("setDate",dateSet.date1);
				clearDateRange(elementsCache);
				elementsCache.cal2.datepicker("setDate",dateSet.date1);
			} else {
				//date range
				autoSelect(dateSet,elementsCache, 2);
				elementsCache.picker.children().hide();
				range_active = false;
				dateafter_active = false;
				elementsCache.date_range_view.show();
				elementsCache.cal2.datepicker("refresh");
				menuSelection(elementsCache.menu_rage_date,elementsCache);
				//reset other views
				clearSpecificDate(elementsCache);
				elementsCache.cal1.datepicker("setDate",dateSet.date1);
				clearDateAfter(elementsCache);
				elementsCache.cal3.datepicker("setDate",dateSet.date1);
			}
		}
        // dismiss the date picker when clicking elsewhere
        $(document).click(function(e) {
            hidePicker(label,elementsCache);
        });

        label.click(function(event) {
            event.stopPropagation();
        });

        elementsCache.container.click(function(event) {
            event.stopPropagation();
        });
    }

    function rangeSelect(dateObj,elementsCache) {
        elementsCache.date_range_input1.removeClass("dp-error");
        elementsCache.date_range_input2.removeClass("dp-error");
        // apply button for date range
        var apply_btn = elementsCache.date_range_view.find(".apply");
        apply_btn.attr("disabled", "disabled");
        if (range_select != 1) {
            // first click, deselect all
            range_select = 1;
            highlight = false;
            date1 = dateObj;
            elementsCache.date_range_input1.attr("value", $.datepicker.formatDate("mm/dd/yy",dateObj));
            apply_btn.attr("disabled", "disabled");
            elementsCache.date_range_input1.removeClass("dp-active");
            elementsCache.date_range_input2.val("");
            elementsCache.date_range_input2.addClass("dp-active");
        } else {
            // second select
            // if date of the second select is after the first
			if (dateObj>date1) {
                range_select = 2;
                date2 = dateObj;
                highlight = true;
                range_active = true;
                elementsCache.date_range_input2.attr("value", $.datepicker.formatDate("mm/dd/yy",dateObj));
                apply_btn.removeAttr('disabled');
                elementsCache.err_msg.fadeOut('slow');
                elementsCache.date_range_input1.addClass("dp-active");
                elementsCache.date_range_input2.removeClass("dp-active");
            } else {
                range_select = 1;
                date1 = dateObj;
                elementsCache.date_range_input1.attr("value", $.datepicker.formatDate("mm/dd/yy",dateObj));
                apply_btn.attr("disabled", "disabled");
            }
        }
    }

    function hidePicker(label,elementsCache){
        label.find('.dp-up').removeClass('dp-up').addClass('dp-down');
		elementsCache.container.hide();
        clear_error_msg(elementsCache);
    }

    function afterdateSelect(date,elementsCache) {
        dateafter_active = true;
        date_since = date;
        elementsCache.after_date_input.attr("value", $.datepicker.formatDate("mm/dd/yy",date));

    }

    function setupCalendars(label,elementsCache) {
		var settings=label.data("dpsettings");
		if (settings) {
			var max=settings.maxDate;
		} else {
			var max=new Date();
		}
		
        elementsCache.cal1.datepicker({
            maxDate : max,
            onSelect : function(dateText, inst) {
                elementsCache.spec_date_input.attr("value", dateText);
                elementsCache.spec_date_input.removeClass("dp-error");
                specdate_active=true;
                elementsCache.specific_date_view.find(".apply").removeAttr("disabled");
            }
        });

        elementsCache.cal2.datepicker({
            numberOfMonths : 3,
            maxDate : max,
            onSelect : function(dateText){
							rangeSelect($.datepicker.parseDate("mm/dd/yy",dateText), elementsCache);
						},
            beforeShowDay : function(date) {
                if (highlight) {
					if (date>=date1 && date<=date2) {
                        if (range_active) {
                            return [ true, 'dp-highlight' ];
                        } else {
                            return [ true, 'highlight_history' ];
                        }
                    }
                }
                return [ true, '' ];
            }
        });

        elementsCache.cal3.datepicker({
            numberOfMonths : 3,
            maxDate : max,
            onSelect : function(dateText) {
                afterdateSelect($.datepicker.parseDate("mm/dd/yy",dateText),elementsCache);
				elementsCache.after_date_input.removeClass("dp-error");
                elementsCache.after_date_view.find(".apply").removeAttr("disabled");
            },
            beforeShowDay : function(date) {
                if (date_since) {
                    //var newDate = formateDate(date);
					if (date>=date_since && date<=max) {
                        if (dateafter_active) {
                            return [ true, 'dp-highlight' ];
                        } else {
                            return [ true, 'highlight_history' ];
                        }
                    }
                }
                return [ true, '' ];
            }
        });

        elementsCache.picker.find(".apply").bind("click", function() {
            var $this = $(this);
			var hasErr=false;
			$this.parent().find("input").each(function(){
				if ($(this).hasClass("dp-error")) {
					hasErr=true;;
				}
			});
			if (hasErr) {
				return;
			}
            apply($this);
            //storeData(label,elementsCache);
            $this.attr("disabled","disabled");
            hidePicker(label,elementsCache);
        });

        elementsCache.picker.find(".dp-cancel a").bind("click", function(e) {
            //e.preventDefault();
            hidePicker(label,elementsCache);
        });

        elementsCache.picker.find(".dp-date-display").blur(
            function(e) {
                var $this=$(this);
                var frame = $this.parent().parent();
                //var id = frame.attr("id");
                if (frame.hasClass("spec-date-view")) {
					try {
						var date=$.datepicker.parseDate("mm/dd/yy",elementsCache.spec_date_input.val());
						if (date>new Date()) {
							throw "err";
						}
                        elementsCache.cal1.datepicker("setDate", date);
                        elementsCache.spec_date_input.removeClass("dp-error");
                        frame.find(".apply").removeAttr("disabled");
                    } catch(err) {
                        elementsCache.spec_date_input.addClass("dp-error");
                    }
                } else if (frame.hasClass("date-range-view")) {
					try {
						var d1=$.datepicker.parseDate("mm/dd/yy",elementsCache.date_range_input1.val());
						var d2=$.datepicker.parseDate("mm/dd/yy",elementsCache.date_range_input2.val());
						var today=new Date();
						if (d1<today && d2<today) {
							if (d1<d2) {
                                date1 = d1;
                                date2 = d2;
                                if ($this.hasClass("date1")) {
                                    elementsCache.cal2.datepicker("setDate", date1);
                                    range_select = 2;
                                    highlight = true;
                                    range_active = true;
									$that=$this.next().next();
									$this.removeClass("dp-active");
									$that.addClass("dp-active");
									$that.focus();
                                } else if ($this.hasClass("date2")) {
                                    range_select = 1;
                                    range_active = true;
                                    highlight = true;
                                }
                                elementsCache.date_range_input1.removeClass("dp-error");
                                elementsCache.date_range_input2.removeClass("dp-error");
                                elementsCache.err_msg.fadeOut('slow');
                                elementsCache.err_msg1.fadeOut('slow');
                                frame.find(".apply").removeAttr("disabled");
                            } else {
                                elementsCache.err_msg.css("display", "inline");
                                $this.addClass("dp-error");
                                return false;
                            }
                        } else {
                            elementsCache.err_msg1.css("display", "inline");
                            $this.addClass("dp-error");
                            return false;
                        }
                    } catch(err) {
                        $this.addClass("dp-error");
                        return false;
                    }
                } else if (frame.hasClass("after-date-view")) {
					try {
						var date=$.datepicker.parseDate("mm/dd/yy",elementsCache.after_date_input.val());
						if (date>new Date()) {
							throw "err";
						}
                        afterdateSelect(date,elementsCache);
                        elementsCache.cal3.datepicker("setDate", date);
                        elementsCache.after_date_view.find(".apply").removeAttr("disabled");
                        elementsCache.after_date_input.removeClass("dp-error");
                    } catch(err) {
                        elementsCache.after_date_input.addClass("dp-error");
                    }
                }
            });


		function apply(btn) {
			var view = btn.parent().parent();
			if (view.hasClass("spec-date-view")) {
				var date = elementsCache.spec_date_input.attr("value");
				$.datepicker.parseDate("mm/dd/yy",date);
				label.find("span:first").text(date);
				label.find("input").each(function() {
					$(this).val(date);
				});
				elementsCache.spec_date_input.removeClass("dp-error");
				return true;
			} else if (view.hasClass("date-range-view")) {
				var date1 = elementsCache.date_range_input1.attr("value");
				var date2 = elementsCache.date_range_input2.attr("value");
				$.datepicker.parseDate("mm/dd/yy",date1);
				$.datepicker.parseDate("mm/dd/yy",date2);
				label.find("span:first").text(date1 + " - " + date2);
				elementsCache.date_range_input1.removeClass("dp-error");
				elementsCache.date_range_input2.removeClass("dp-error");
				var count = 1;
				label.find("input").each(function() {
					if (count==1) {
						$(this).val(date1);
						count++;
					}else {
						$(this).val(date2);
					}
				});
				return true;
			} else if (view.hasClass("after-date-view")) {
				var date = elementsCache.after_date_input.attr("value");
				label.find("span:first").text(date + " - " + formateDate(new Date()));
				elementsCache.after_date_view.removeClass("dp-error");
				var count = 1;
				label.find("input").each(function() {
					if (count==1) {
						$(this).val(date);
						count++;
					}else {
						$(this).val(formateDate(new Date()));
					}
				});
				return true;
			} else {
				$.error("invalid picker view id");
			}
		}
    }

	function formateDate(date) {
		return $.datepicker.formatDate('mm/dd/yy',date);
	}


	

	function autoSelect(dateSet,elementsCache, type) {
		if (type == 1) {
			// config specific date autoselect
			elementsCache.spec_date_input.attr("value", $.datepicker.formatDate("mm/dd/yy",dateSet.date2));
			elementsCache.cal1.datepicker("setDate", dateSet.date2);
		} else if (type == 2) {
			// config date range autoselect
			rangeSelect(dateSet.date1, elementsCache);
			rangeSelect(dateSet.date2,elementsCache);
			range_active = false;
			elementsCache.cal2.datepicker("setDate", dateSet.date2);
			var today = new Date();
			var prev = elementsCache.cal2.find(".ui-datepicker-prev");
			prev.trigger("click");
			prev.trigger("click");
			elementsCache.date_range_view.find(".apply").attr("disabled","disabled");
		} else if (type == 3) {
			// config after date autoselect
			afterdateSelect(dateSet.date1,elementsCache);
			elementsCache.cal3.datepicker("setDate", dateSet.date1);
		}
	}

	function clearSpecificDate(elementsCache) {
		elementsCache.spec_date_input.val("");
	}
	
	function clearDateRange(elementsCache) {
		elementsCache.date_range_input1.val("");
		elementsCache.date_range_input2.val("");
		date1="";
		date2="";
	}
	
	function clearDateAfter(elementsCache) {
		elementsCache.after_date_input.val("");
		date_since="";
	}

	function clear_error_msg(elementsCache) {
		elementsCache.date_range_input1.removeClass("dp-error");
		elementsCache.date_range_input2.removeClass("dp-error");
		elementsCache.spec_date_input.removeClass("dp-error");
		elementsCache.after_date_input.removeClass("dp-error");
		elementsCache.err_msg.hide();
		elementsCache.err_msg1.hide();
	}
	
	function toDateObj(arg) {
		if (jQuery.type(arg)=="date") {
			return arg;
		} else {
			try {
				return $.datepicker.parseDate("mm/dd/yy",arg);
			} catch (err) {
				$.error(err);
			}
		}
	}

	var methods={
		init: function(options) {
			var defaultSettings={
				specificDate: true,
				dateRange: true,
				afterDate: true,
				startDate: null,
				endDate: null,
				maxDate: new Date()
			};
			var settings=$.extend ({},defaultSettings, options);
			this.data("dpsettings",settings);
			
			//process the settings
			if (settings.startDate){
				settings.startDate=toDateObj(settings.startDate);
				methods["setStartDate"].call(this,settings.startDate);
			}
			if (settings.endDate) {
				settings.endDate=toDateObj(settings.endDate);
				methods["setEndDate"].call(this,settings.endDate);
			}
			if (settings.maxDate!=new Date()) {
				settings.maxDate=toDateObj(settings.maxDate);
			}
			
			this.data("dpsettings",settings);
			
			// cache label
			var elementsCache={};
			var label = $(this);
			var elementsCache=loadData(label);
			if (!elementsCache) {
				elementsCache={};
			}
			label.css("cursor", "pointer");
			decoration(label);
			// create views
			createMenu(elementsCache,label);
			createPickerView(elementsCache,label);
			elementsCache.container.insertAfter(label);
			// do actual work!
			positionEl(elementsCache);
			bindTasks(label,elementsCache);
			setupCalendars(label,elementsCache);
			storeData(label,elementsCache);
		},
		setDate: function(arg) {
			var $input=this.find("input:first");
			if (jQuery.type(arg)=="date") {
				if (arg<=(new Date())) {
					if ($input) {
						var date=$.datepicker.formatDate("mm/dd/yy",arg);
						this.find("span:first").text(date);
						$input.val(date);
						$input.next().val(date);
					} else {
						$.error("Cannot set date because the date picker is not configured correctly! No input field is found!");
					}
				} else {
					$.error("The date you set must be before today!");
				}
			} else if (jQuery.type(arg)=="string") {
				var dates=arg.split("-");
				if (dates.length==2) {
					try {
						$.datepicker.parseDate("mm/dd/yy",dates[0]);
						$.datepicker.parseDate("mm/dd/yy",dates[1]);
						this.find("span:first").text(dates[0]+"-"+dates[1]);
						$input.val(dates[0]);
						$input.next().val(dates[1]);
					} catch(err) {
						$.error(err);
					}
				} else if (dates.length==1) {
					try {
						$.datepicker.parseDate("mm/dd/yy",dates[0]);
						this.find("span:first").text(dates[0]);
						$input.val(dates[0]);
						$input.next().val(dates[0]);
					} catch (err) {
						$.error(err);
					}
				}
			} else {
				$.error("The argument passed into setDate is invalid");
			}
		},
		setStartDate: function(arg) {
			try {
				var $this=$(this);
				var input1=$this.find("input:first");
				var input2=input1.next();
				var date2=input2.val();
				if (jQuery.type(arg)=="date") {
					var d1=arg;
					arg=$.datepicker.formatDate("mm/dd/yy",arg);
				} else {
					var d1=$.datepicker.parseDate("mm/dd/yy",arg);
				}
				var d2=$.datepicker.parseDate("mm/dd/yy",input2.val());
				if (d1>d2) {
					date2=arg;
					$.error("Warning from date range picker: the start date is set after the end date! The end date is automatically pushed forward!");	
				} else if (d1>$this.data("dpsettings").maxDate) {
					arg=input1.val();
					$.error("Warning from date range picker: the start date cannot be set after the max date!")
				}
			} catch (err) {
				$.error(err);
			} finally {
				input1.val(arg);
				$this.find("span:first").text(arg+" - "+date2);
			}
		},
		setEndDate: function(arg) {
			try {
				var input1=this.find("input:first");
				var input2=input1.next();
				var date1=input1.val();
				if (jQuery.type(arg)=="date") {
					var d2=arg;
					arg=$.datepicker.formatDate("mm/dd/yy", arg);
				} else  {
					var d2=$.datepicker.parseDate("mm/dd/yy",arg);
				}
				var d1=$.datepicker.parseDate("mm/dd/yy",input1.val());
				var d2=$.datepicker.parseDate("mm/dd/yy",arg);
				if (d2<d1) {
					date1=arg;
					$.error("Warning from date range picker: the end date is set before the start date! The start date is automatically pushed back!");	
				} else if (d2>this.data("dpsettings").maxDate) {
					arg=input2.val();
					$.error("Warning from date range picker: the end date cannot be set after the max date!")
				}	
			} catch (err) {
				$.error(err);
			} finally {
				input2.val(arg);
				this.find("span:first").text(date1+" - "+arg);
			}
		},
		getStartDate: function() {
			return ($.datepicker.parseDate("mm/dd/yy",this.find("input:first").val()));
		},
		getEndDate: function() {
			return ($.datepicker.parseDate("mm/dd/yy",this.find("input:first").next().val()));
		}
	};
		
	$.fn.drpicker = function(method) {
		initVars();
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		} else if (typeof method==="object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on date range picker');
		}
	};
})(jQuery);
