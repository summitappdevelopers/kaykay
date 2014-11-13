var ProjectBox = React.createClass({
	render: function() {
		function onClick(id) {
			window.location.href = '/project/' + id;
		}

		var projectNodes = this.props.data.data.map(function(project) {
			return (
				<div className="project-row" key={project._id} onClick={onClick.bind(this, project._id)}>
					<h1>{project.title}</h1>
					<span className="last-edited">Created on {project.dateDisplay}.</span>
				</div>
			);
		});

		return (
			<div>
				{projectNodes}
			</div>
		);
	}
});

var projects = JSON.parse($.ajax({
	type: 'GET',
	url: '/api/user/projects',
	async: false
}).responseText);

React.render(
	<ProjectBox data={projects} />,
	$('#renderer').get(0)
);
