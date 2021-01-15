import React from "react";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskname: null,
      error: null,
      isLoaded: false,
      items: [],
      itemLength: 0,
      username: null,
      userpassword: null,
      userLoggedIn : false
    };
  }

  componentDidMount() {
    this.getTaskDetails();
  }

  getTaskDetails = () => {
    fetch("https://todolist15.000webhostapp.com/taskDetails.php")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data,
            itemLength: result.data.length
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  addTask = () => {
    let priority = this.state.itemLength + 1;
    fetch(
      "https://todolist15.000webhostapp.com/addTask.php?task_name=" +
        this.state.taskname+ "&task_priority="+priority+"&user_no=1"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.getTaskDetails();
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  handleChange = (e) => {
    this.setState({ taskname: e.target.value });
  };

  deleteTask = (task_no) => {
    fetch(
      "https://todolist15.000webhostapp.com/removeTask.php?task_no=" + task_no
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.getTaskDetails();
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  handleChangeName = (e) => {
    this.setState({username : e.target.value})
  }

  handleChangePassword = (e) => {
    this.setState({userpassword : e.target.value})
  }

  userLogin = () => {
    fetch(
      "https://todolist15.000webhostapp.com/userDetails.php?username=" + this.state.username+ "&userpass="+this.state.userpassword
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if(result.status === "success"){
            this.setState({userLoggedIn : true});
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, items } = this.state;
    return (
      <React.Fragment>
        <div>To Do App</div><br/>
        {!this.state.userLoggedIn ? (
          <div>
            <input type="text" onChange={(e) => this.handleChangeName(e)} />
            <input type="password" onChange={(e) => this.handleChangePassword(e)} />
            <button onClick={() => this.userLogin()}>Login</button>
          </div>
        ) : (
          <React.Fragment>
            <div className="App">
              <input type="text" onChange={(e) => this.handleChange(e)} />
              <button onClick={() => this.addTask()}>Add Task</button>
            </div>

            <div>
              {error && <div>Error: {error.message}</div>}
              {!isLoaded && <div>Loading...</div>}
              {!error && isLoaded && (
                <ul>
                  <div className="heading">Task Name</div>
                  {items.map((item) => (
                    <li key={item.task_no}>
                      {item.task_name}
                      <div
                        className="removeBtn"
                        onClick={(task_no) => this.deleteTask(item.task_no)}
                        title="delete"
                      >
                        x
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </React.Fragment>
        )}
        

        
      </React.Fragment>
    );
  }
}
