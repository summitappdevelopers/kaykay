var AddModal = React.createClass({
	getInitialState: function() {
		return { title: '' };
	},
	titleOnChange: function(e) {
		this.setState({ title: e.target.value })
	},
	handleAddProject: function() {
		if (this.state.title === '') {
			return;
		}

		var project = {
			title: this.state.title
		};

		$.post('/api/project/create', project, (function(response) {
			if (response.ok) {
				this.props.addProject(response.data);
				this.props.dismissModal();
			} else {
				throw new Error('There was a problem creating the project. Message: "' + response.message + '".');
			}
		}).bind(this));
	},
	render: function() {
		return (
			<div key="modal" className={this.props.shouldShow ? "addDialog fadeIn" : "addDialog fadeOut"}>
				<h1>Project Title</h1>
				<input onChange={this.titleOnChange} value={this.state.title} className="titleInput" autoFocus/>
				<div className="dialog-button dialog-button-create" onClick={this.handleAddProject}><span>create</span></div>
				<div className="dialog-button dialog-button-cancel" onClick={this.props.cancelDialog}><span>cancel</span></div>
			</div>
		);
	}
});

var ProjectElement = React.createClass({
	onClick: function(e) {
		var parent_div = $(e.target);

		while(parent_div.prop('tagName') !== 'DIV') {
			parent_div = parent_div.parent();
		}

		window.location.href = '/project/' + parent_div.attr('data-key');
	},
	render: function() {
		return (
			<div key={this.props.project._id + 'element'} >
				<div className="project-row" onClick={this.onClick} data-key={this.props.project._id}>
					<h1>{this.props.project.title}</h1>
					<span className="last-edited">Created on {this.props.project.dateDisplay}.</span>
				</div>
				<img className="delete-img" src="/img/x.svg" onClick={this.props.removeProject}></img>
			</div>
		);
	}
});

var ProjectList = React.createClass({
	render: function() {
		var createProject = (function createProject(project) {
			return <ProjectElement key={project._id + "project_element"} project={project} removeProject={this.props.removeProject.bind(this, project._id)} />;
		}).bind(this);

		return (
			<div key={'project-container'}>
				{this.props.projects.map(createProject)}
			</div>
		);
	}
});

var ProjectApp = React.createClass({
	getInitialState: function() {
		return {
			projects: (project_json = JSON.parse($.ajax({ type: 'GET', url: '/api/user/projects', async: false}).responseText).data),
			shouldShowAddModal: false
		};
	},
	addProject: function(project) {
		this.state.projects.push(project);
		this.setState({ projects: this.state.projects });
	},
	showModal: function() {
		this.setState({ shouldShowAddModal: true });
	},
	dismissModal: function() {
		this.setState({ shouldShowAddModal: false });
	},
	removeProject: function(id) {
		var index = -1;

		for (var iter = 0; iter < this.state.projects.length; iter++) {
			var project = this.state.projects[iter];

			(id === project._id) && (index = iter);
		}

		if (index !== -1) {
			this.state.projects.splice(index, 1);
			this.setState({ projects: this.state.projects });

			$.get('/api/project/' + id + '/remove', function(response) {
				if (!response.ok) {
					throw new Error('Removing project with id "' + id + '" failed. Message: "' + response.message + '".');
				}
			});
		}
	},
	render: function() {
		return (
			<div key="master">
				<h1>Projects</h1>
				<div id="addButton">
					<img className="add-image" src="/img/add.svg" onClick={this.showModal}></img>
					<AddModal shouldShow={this.state.shouldShowAddModal} dismissModal={this.dismissModal} addProject={this.addProject} />
				</div>
				<hr />
				<div id="projects">
					<ProjectList projects={this.state.projects} removeProject={this.removeProject} />
				</div>
			</div>
		);
	}
});

React.render(
	<ProjectApp />,
	$('.project-container').get(0)
);
