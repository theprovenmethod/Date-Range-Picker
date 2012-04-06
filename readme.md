#Date-Range Picker#
The Date-range picker is a highly interactive and configurable plugin that allows the user to select/enter a specific date or a date range on a GUI calendar. By default, the date-range picker has three picker views, which are specific date view, date range view and all dates after view. The views are switched by a menu. The specific date view allows the user to select one specific date. The date range view let the user to select a start date and an end date. The all days after view let the user select a start date and the end date is default to today or the max date specified by the developer when initializing the plugin). The web developer can also disable a certain view for certain purpose by passing the options argument when initializing the date picker. The result of the date selection will be displayed inside of the div tag specified by the web developer. In addition, the date-range picker will also populate two hidden input fields inside of the div tag as the start date and the end date whenever the user selects the date range. If the user selects one specific date, the start date will be the same as the end date. The start date and the end date will be The plugin itself is based upon the JQuery UI date picker widget. Therefore, JQuery and JQuery UI library must be imported before you attempt to use this plugin.

##Initialization##
The html source must abide the pattern below in order to have the date-rage picker work correctly.

    <div class=”Your class name”>
		<span>Insert the default date here</span>
		<input type=”hidden” value=”default start date”/>
		<input type=”hidden” value=”default end date”/>
    </div>

To initialize the date-range picker, just simply call drpicker on the div selection in javascript.



##### Here is an example:

    <div class=”example”>
		<span>4/2/2012-4/5/2012</span>
		<input type=”hidden” value=”4/2/2012”/>
		<input type=”hidden” value=”4/5/20”/>
    </div>

To initialize the date-rangepicker, just simple do $(“.example”).drpicker();


##Options

You may pass an optional object parameter (JSON format) to further configure the plugin when initializing the plugin. 

| Option          | Argument Type                | Default    |Effect                             |
| --------------- | ---------------------------- | ---------- | --------------------------------- |
|specificDate(arg)|Boolean                       | True       | Enable/disable specific date view |
|dateRange(arg)   | Boolean                      | True       | Enable/disable date range view    |
|afterDate(arg)   | Boolean                      | True       | Enable/disable after date view    |
|startDate(arg)   | Date or String(“mm/dd/yyyy”) | Null       | Set the start date of the         |
|endDate(arg)     | Date or String(“mm/dd/yyyy”) | Null       | Set the end date                  |
|maxDate(arg)     | Date or String(“mm/dd/yyyy”) | new Date() | Set the maximum date allowed      |

Example:

    $(“.example”).drpicker({
    				afterDate: false,
    				startDate: “01/01/2011”,
    				maxDate: ”03/12/2012”
    });
	
$(“.example”).drpicker({
					afterDate: false,
					startDate: “01/01/2011”,
					maxDate: ”03/12/2012”
});

##Methods

You may call the following methods after the date-range picker is initialized.

| Method            | Return Type          | Argument Type                    | Detail                                                  |
| ----------------- | -------------------- | -------------------------------- | ------------------------------------------------------- |
| setDate(arg)      | void                 | String (“mm/dd/yyyy-mm/dd/yyyy”) | The method takes two dates and must be separated by “-” |
| setStartDate(arg) | void                 | String(“mm/dd/yyyy”)             | Set the start date                                      |
| setEndDate(arg)   | void                 | String(“mm/dd/yyyy”)             | Set the end date                                        |
| getStartDate()    | String(“mm/dd/yyyy”) | n/a                              |Get the current start date                               |
| getEndDate()      |String(“mm/dd/yyyy”)  | n/a                              |Get the current end date                                 |
