var React = require('react');

var CurrentLocation = React.createClass({
	toggleFavourite() {
		this.props.onFavouriteToggle(this.props.address);
	},

	render() {
		var starClassName = "glyphicon glyphicon-star-empty";

		if(this.props.favourite) {
			starClassName = "glyphicon glyphicon-star";
		}

		return (
			<div className="col-xs-12 col-md-6 col-md-offset-3 current-location">
				<h4 id="save-location">{this.props.address}</h4>
				<span className={starClassName} onClick={this.toggleFavourite} aria-hidden="true"></span>
			</div>
		);
	}
});

module.exports = CurrentLocation;
