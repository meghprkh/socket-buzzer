/*=====================================================
*
*	JAVASCRIPT : A Really Small JavaScript framework for Selecting then Printing a particular div in a reading format
*	(c) Pinkesh Badjatiya 2016
*
======================================================*/

/*
	INSTRUCTIONS:
	---------------------------
	_(document.body).enable(); 	<===	to run the library
*/

/*	_ Object Constructors
========================*/

function _(id) {

	/* About object is returned if there is no 'id' parameter */
	var about = {
		Version: 0.5,
		Author: "Pinkesh Badjatiya",
		Created: "Winter 2015",
		Updated: "20 January 2016"
	};

	if (id) {
		/*
	        Avoid clobbering the window scope:
			return a new _ object if we're in the wrong scope
		*/
        if (window === this) {
			return new _(id);
		}

		/*
	        We're in the correct object scop:
			Init our element object and return the object
			this.e = document.getElementById(id);
        */
        this.e = id;
		return this;
	} else {
		return about; /* No 'id' paramter was given, return the 'about' object */
	}
}

/*	_ Prototype Functions
============================*/

_.prototype = {
	enable:		function() {
					_(document.body).loadcss();
					_(document.body).registerEvents();
				},
    loadcss:    function(){
                    var css_t = "<style id='print-lib-css' type='text/css'> .outline-element { color:red; outline: 1px solid #c00;}; .outline-element-clicked {outline: 1px solid #0c0;} </style>";
                    $(css_t).appendTo(document.body);
                    return this;
                },
    unloadcss:    function(){
                    $('#print-lib-css').remove();
                    return this;
                },
    printdiv:   function (){
                    console.log(this.e);
                    var data = this.e.innerHTML;
                    var mywindow = window.open('', 'my div', 'height=400,width=600');
                    mywindow.document.write('<html><head><title>my div</title>');
                    mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">');
                    mywindow.document.write('</head><body >');
                    mywindow.document.write(data);
                    mywindow.document.write('</body></html>');

                    mywindow.document.close(); /* necessary for IE >= 10 */
                    mywindow.focus(); /* necessary for IE >= 10 */

                    mywindow.print();
                    mywindow.close();

					return this;
                },
    registerEvents: function(callback) {
                this.e.addEventListener('mouseover', function(event) {
                    $(event.target).addClass('outline-element');
                }, false);

                this.e.addEventListener('mouseout', function(event) {
                    $(event.target).removeClass('outline-element');
                }, false);

                this.e.addEventListener('click', function(event) {
                    $(event.target).toggleClass('outline-element-clicked');
                    _(this).printdiv();
					_(this).disable();
				}, false);

                return this;
            },
	disable:	function(){
                _(document.body).unloadcss();
                $(document.body).unbind('mouseout').unbind('mouseover').unbind('click');
				$('.outline-element').each(function(i, obj){ console.log(i); console.log(obj);  obj.classList.remove('outline-element')});
				$('.outline-element-clicked').each(function(i, obj){ console.log(i); console.log(obj);  obj.classList.remove('outline-element')});
			}
};
