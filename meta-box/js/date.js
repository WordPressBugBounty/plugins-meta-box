( function ( $, _, rwmb ) {
	'use strict';

	/**
	 * Transform an input into a date picker.
	 */
	function transform() {
		let $this = $( this ),
			options = $this.data( 'options' );

		let $inline = $this.siblings( '.rwmb-datetime-inline' );
		if ( !$inline.length ) {
			$inline = $this.closest( '.rwmb-input-group' ).siblings( '.rwmb-datetime-inline' );
		}

		let $timestamp = $this.siblings( '.rwmb-datetime-timestamp' ),
			current = $this.val(),
			$picker = $inline.length ? $inline : $this;

		$this.siblings( '.ui-datepicker-append' ).remove(); // Remove appended text

		options.onSelect = function () {
			$this.trigger( 'change' );
		};
		options.beforeShow = function ( i ) {
			if ( $( i ).prop( 'readonly' ) ) {
				return false;
			}
		};

		if ( $timestamp.length ) {
			options.onClose = options.onSelect = function () {
				$timestamp.val( getTimestamp( $picker.datepicker( 'getDate' ) ) );
				$this.trigger( 'change' );
			};

			$this.on( 'change', () => {
				if ( !$this.val() ) {
					$timestamp.val( '' );
				}
			} );
		}

		if ( !$inline.length ) {
			$this.removeClass( 'hasDatepicker' ).datepicker( options );
			return;
		}

		options.altField = '#' + $this.attr( 'id' );
		$this.on( 'keydown', _.debounce( function () {
			// if val is empty, return to allow empty datepicker input.
			if ( !$this.val() ) {
				return;
			}
			$picker
				.datepicker( 'setDate', $this.val() )
				.find( '.ui-datepicker-current-day' )
				.trigger( 'click' );
		}, 600 ) );

		$inline
			.removeClass( 'hasDatepicker' )
			.empty()
			.prop( 'id', '' )
			.datepicker( options )
			.datepicker( 'setDate', current );
	}

	/**
	 * Convert date to Unix timestamp in milliseconds
	 * @link http://stackoverflow.com/a/14006555/556258
	 * @param date
	 * @return number
	 */
	function getTimestamp( date ) {
		if ( date === null ) {
			return '';
		}
		var milliseconds = Date.UTC( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
		return Math.floor( milliseconds / 1000 );
	}

	function init( e ) {
		/**
		 * WordPress sets localized data for jQuery UI datepicker at document ready.
		 * Using setTimeout to ensure the code runs after the localized data is set.
		 * @link https://wordpress.org/support/topic/inline-date-field-not-localization/
		 */
		setTimeout( () => {
			$( e.target ).find( '.rwmb-date' ).each( transform );
		}, 0 );
	}

	rwmb.$document
		.on( 'mb_ready', init )
		.on( 'clone', '.rwmb-date', transform );
} )( jQuery, _, rwmb );
