var projects = JSON.parse($.ajax({
	type: 'GET',
	url: '/api/user/projects',
	async: false
}).responseText).data;


var ProjectBox = React.createClass({
	render: function() {
		function onClick(id) {
			window.location.href = '/project/' + id;
		}

		var projectNodes = this.props.projects.map(function(project) {
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

React.render(
	<ProjectBox projects={projects} />,
	$('#projects').get(0)
);

var AddButton = React.createClass({
	getInitialState:function(){
		return {showDialog: false};
	},
	render: function() {
		function handleClick(e){
			this.setState({showDialog: true});
		}

		window._____l = this;

		return (
			<div>
				<img className="add-image" src="/img/add.svg" onClick={handleClick.bind(this)}></img>
				{this.state.showDialog?<AddDialog/>:null}
			</div>
		);
	}

});

var AddDialog = React.createClass({


	getInitialState: function() {
		return {isShown: true};
	},

	titleOnChange: function(e){
		this.setState({title:e.target.value});
	},

	render: function() {

		function createProject(){
			this.setState({showDialog: false});
			_____l.replaceState(true);
			console.log(this.state.title);
			$.post('/api/project/create',{title:this.state.title}, function(data){
				projects.push(data.data);
				React.render(
					<ProjectBox projects={projects} />,
					$('#projects').get(0)
				);
			});
		}

		function cancelDialog(){
			this.setState({showDialog: false});
			_____l.replaceState(true);
		}

		return (

			<div className={this.state.isShown?"addDialog fadeIn":"addDialog fadeOut"}>
				<h1>Project Title</h1>
				<input onChange={this.titleOnChange} value={this.state.title} className="titleInput" autoFocus/>
				<div className="dialog-button dialog-button-create" onClick={createProject.bind(this)}><span>create</span></div>
				<div className="dialog-button dialog-button-cancel" onClick={cancelDialog.bind(this)}><span>cancel</span></div>
			</div>

		);

	}

});

React.render(
		<AddButton />,
		$('#addButton').get(0)
);

