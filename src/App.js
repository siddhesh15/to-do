import React from "react";
import "./styles.css";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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

  handleChangePriority = (e,task_no) =>{
    if(e.target.value){
      fetch(
        "https://todolist15.000webhostapp.com/updateTask.php?task_no="+task_no+"&task_priority="+e.target.value
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
    }

  }

  render() {
    const { error, isLoaded, items } = this.state;
    return (
      <React.Fragment>
        <div className="mainheading">To Do App</div>
        {!this.state.userLoggedIn ? (
          <div className="loginContainer">
            <Input placeholder="Enter Username" type="text" onChange={(e) => this.handleChangeName(e)} />
            <Input placeholder="Enter Password" type="password" onChange={(e) => this.handleChangePassword(e)} />
            <Button variant="contained" color="primary" onClick={() => this.userLogin()} >Login</Button>
          </div>
        ) : (
          <React.Fragment>
            <div className="App">
              <Input placeholder="Enter Taskname" type="text" onChange={(e) => this.handleChange(e)} />
              <Button variant="contained" color="secondary" onClick={() => this.addTask()}>Add Task</Button>
            </div>
          
            <div>
              {error && <div>Error: {error.message}</div>}
              {!isLoaded && <div>Loading...</div>}
              {!error && isLoaded && (
                <div className="tableBase">
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr No</TableCell>
                          <TableCell align="right">Task Name</TableCell>
                          <TableCell align="right">Priority</TableCell>
                          <TableCell align="right">Delete</TableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item,index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {index+1}
                            </TableCell>
                            <TableCell align="right">{item.task_name}</TableCell>
                            <TableCell align="right">
                              <input className="priority" type="number" value={item.task_priority} onChange={(e,task_no) => this.handleChangePriority(e, item.task_no)}/>
                            </TableCell>
                            <TableCell align="right">
                              <DeleteIcon onClick={(task_no) => this.deleteTask(item.task_no)} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
  
                  </div>
              )}
            </div>
          </React.Fragment>
        )}
        

        
      </React.Fragment>
    );
  }
}
