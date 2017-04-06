var React = require('react');

// Import other modules
var Search = require('./Search');
var Map = require('./Map');
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');

var App = React.createClass({

	getInitialState() {
		//Extract the favourite locations from local storage
		var favourites = [];

		if(localStorage.favourites) {
			favourites = JSON.parse(localStorage.favourites);
		}

		// Location is centered on Paris by default
		return {
			favourites: favourites,
			currentAddress: 'Paris, France',
			mapCoordinates: {
				lat: 48.856614,
				lng: 2.3522219
			}
		};
	},

	toggleFavourite(address) {
		if(this.isAddressInFavourites(address)) {
			this.removeFromFavourites(address);
		} else {
			this.addToFavourites(address);
		}
	},

	addToFavourites(address) {
		var favourites = this.state.favourites;

		favourites.push({
			address: address,
			timestamp: Date.now()
		});

		this.setState({
			favourites: favourites
		});

		localStorage.favourites = JSON.stringify(favourites);
	},

	removeFromFavourites(address) {
		var favourites = this.state.favourites;
		var index = -1;

		for(var i = 0; i < favourites.length; i++) {
			if(favourites[i].address == address) {
				index = i;
				break;
			}
		}

		// If it was found, remove it from the favourites array
		if(index !== -1) {
			favourites.splice(index, 1);

			this.setState({
				favourites: favourites
			});

			localStorage.favourites = JSON.stringify(favourites);
		}
	},

	isAddressInFavourites(address) {
		var favourites = this.state.favourites;

		for(var i = 0; i < favourites.length; i++) {
			if(favourites[i].address == address) {
				return true;
			}
		}

		return false;
	},

	searchForAddress(address) {
		var self = this;

		// We will use GMaps' geocode functionality,
		// which is built on top of the Google Maps API

		GMaps.geocode({
			address: address,
			callback: function(results, status) {
				if(status !== 'OK') return;

				var latlng = results[0].geometry.location;

				self.setState({
					currentAddress: results[0].formatted_address,
					mapCoordinates: {
						lat: latlng.lat(),
						lng: latlng.lng()
					}
				});
			}
		});
	},

	render() {
		return (
			<div>
				<h1>Your Google Maps Locations</h1>

				<Search onSearch={this.searchForAddress} />

				<Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />

				<CurrentLocation address={this.state.currentAddress} favourite={this.isAddressInFavourites(this.state.currentAddress)} onFavouriteToggle={this.toggleFavourite} />

				<LocationList locations={this.state.favourites} activeLocationAddress={this.state.currentAddress} onClick={this.searchForAddress} />
			</div>
		);
	}

});

module.exports = App;
