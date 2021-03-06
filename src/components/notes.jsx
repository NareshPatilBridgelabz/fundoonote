import React from "react";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { Menu, MenuItem, Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Card, Tooltip } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ArchiveIcon from "@material-ui/icons/Archive";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import PlaceIcon from "@material-ui/icons/Place";
import { deleteRestoreUserNote } from "../services/noteServices";
import { updateUserNote } from "../services/noteServices";
import { addUpdateReminderNote } from "../services/noteServices";
import { removeReminderNote } from "../services/noteServices";
import { changesColorNotes } from "../services/noteServices";
import { archiveNote } from "../services/noteServices";
import { deleteNoteForever } from "../services/noteServices";
import { removeNoteLabel } from "../services/noteServices";
import { addcollaboratorsNotes } from "../services/noteServices";
import { removeCollaboratorsNotes } from "../services/noteServices";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Checkbox from "@material-ui/core/Checkbox";
import ColorBox from "./colorBox";
import AddLabelSubNote from "./addLabelSubNote";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import { UserConsumer } from "./userContext.js";
import Collaborator from "./collaborator";

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NoteReminderMenuAnchor: null,
      NoteReminderMenuOpen: false,
      MoreMenuAnchor: null,
      MoreMenuOpen: false,
      // noteData:props.noteData,
      noteData: props.noteData,
      title: props.noteData.title,
      description: props.noteData.description,
      noteID: props.noteData.id,
      noteRefresh: props.noteRefresh,
      dialogBoxOpen: false,
      reminderMsg: props.noteData.reminder[0] ? props.noteData.reminder[0] : "",
      reminderDisplay: props.noteData.reminder[0] ? "flex" : "none",
      list: props.noteData.noteCheckLists,
      displayReminder: "",
      displayDatePick: "none",
      noteColor: props.noteData.color,
      labelIdList: props.noteData.labelIdList,
      isArchive: props.noteData.isArchived,
      noteDelete: props.noteData.isDeleted,
      listdata: [],
      noteLabels: props.noteData.noteLabels,
      collaborators: props.noteData.collaborators,
      userData:JSON.parse(localStorage.getItem('userDetails')),
      askedQuesion:''
    };
    if(props.noteData.questionAndAnswerNotes.length > 0){
      this.state.askedQuesion=props.noteData.questionAndAnswerNotes[0].message
    }
  }
  addNoteLabelTemporary = (label, id) => {
    let data = {
      label: label,
      isDeleted: false,
      id: id,
      userId: this.state.noteData.userId,
    };
    this.state.noteLabels.push(data);
    this.setState({ noteLabels: this.state.noteLabels });
  };
  timing = [
    {
      value: "morning8:00AM",
      label: "morning8:00AM",
    },
    {
      value: "afternoon1:00PM",
      label: "afternoon1:00PM",
    },
    {
      value: "evening4:00PM",
      label: "evening4:00PM",
    },
    {
      value: "night8:00PM",
      label: "night8:00PM",
    },
  ];
  remiderHandler = (event) => {
    this.setState({
      NoteReminderMenuAnchor: event.currentTarget,
      NoteReminderMenuOpen: !this.state.NoteReminderMenuOpen,
    });
  };
  moreMenuHandler = (event) => {
    this.setState({
      MoreMenuAnchor: event.currentTarget,
      MoreMenuOpen: !this.state.MoreMenuOpen,
    });
  };
  onClickTitle = (event) => {
    // this.setState({title:event.currentTarget.value})
    this.handelNoteDialogBox();
  };
  onClickNote = (event) => {
    // this.setState({description:event.currentTarget.value})
    this.handelNoteDialogBox();
  };
  noteDeleteRestore = (e, deleteNote) => {
    this.props.backDropEffect()
    let deleteData = { isDeleted: deleteNote, noteIdList: [this.state.noteID] };
    deleteRestoreUserNote(deleteData).then((response) => {
      this.state.noteRefresh();
    });
  };
  handelNoteDialogBox = () => {
    this.setState({
      dialogBoxOpen: !this.state.dialogBoxOpen,
    });
  };
  onChangeTitle = (event) => {
    this.setState({ title: event.currentTarget.value });
  };
  onChangeDescription = (event) => {
    this.setState({ description: event.currentTarget.value });
  };
  updateNoteClick = () => {
    let update_Data = new FormData();
    update_Data.append("noteId", this.state.noteID);
    update_Data.append("title", this.state.title);
    update_Data.append("description", this.state.description);
    update_Data.append("color", this.state.noteColor);
    updateUserNote(update_Data).then((response) => {});
    this.handelNoteDialogBox();
    this.state.noteRefresh();
  };
  addUpdateReminder = (date) => {
    // alert(this.state.reminderMsg)
    let reminderData = { reminder: date, noteIdList: [this.state.noteID] };
    addUpdateReminderNote(reminderData).then((response) => {});
    this.state.noteRefresh();
  };

  onClickCheckList = () => {};
  clickPickDate = () => {
    this.setState({
      displayReminder: this.state.displayReminder === "" ? "none" : "",
    });
    this.setState({
      displayDatePick: this.state.displayDatePick === "" ? "none" : "",
    });
  };
  handleChangeDate = (event) => {
    this.setState({ date: event.target.value });
  };
  setReminderOnclick = (event) => {
    let time = "";
    let date = new Date();
    if (event.target.getAttribute("time")) {
      time = new Date(
        date.setDate(
          date.getDate() + parseInt(event.target.getAttribute("time"))
        )
      ).toString();
    } else {
      time = new Date(this.state.date).toString();
    }
    this.setState({ reminderMsg: time });
    this.setState({ reminderDisplay: "flex" });
    this.setState({ reminderMenuOpen: !this.state.reminderMenuOpen });

    this.addUpdateReminder(time);
  };
  reminderClose = () => {
    removeReminderNote(this.state.noteID).then((response) => {});
    this.setState({ reminderDisplay: "none" });
    this.setState({ reminderMsg: "" });
    this.state.noteRefresh();
  };
  onClickChanageColor = async (event) => {
    await this.setState({ noteColor: event.target.getAttribute("color") });
    let colorData = {
      color: this.state.noteColor,
      noteIdList: [this.state.noteID],
    };
    changesColorNotes(colorData);
  };
  onClickArchive = async () => {
    this.props.backDropEffect()
    await this.setState({ isArchive: !this.state.isArchive });
    let archiveData = {
      isArchived: this.state.isArchive,
      noteIdList: [this.state.noteID],
    };
     archiveNote(archiveData).then( res =>  {
                                           this.state.noteRefresh()
                                           });
  };
  noteDeleteForever = () => {
    this.props.backDropEffect()
    let deleteData = { noteIdList: [this.state.noteID] };
    deleteNoteForever(deleteData).then(() => this.state.noteRefresh());
   
  };
  removeLabeFromNote = (labelId, index) => {
    this.state.noteLabels.splice(index, 1);
    removeNoteLabel(labelId, this.state.noteID).then((response) => {
      if (response) {
        this.state.noteRefresh();
      }
    });
  };
  clickOnUser = (user) => {
    let matched = this.state.userData.email === user.email?true:false
    this.state.collaborators.map(coll => {
      matched = user.email === coll.email?true:matched
    })
    if(matched) {
      this.props.displaySnackbar(true,'info','Collaboratore already exist.')
      return
    }
    this.state.collaborators.push(user);
    this.setState({ collaborators: this.state.collaborators });
    addcollaboratorsNotes(user, this.state.noteID);
  };
  removeCollab = (CID) => {
    let filterCollab = this.state.collaborators.filter((collab) => {
      return collab.userId !== CID;
    });
    removeCollaboratorsNotes(CID, this.state.noteID);
    this.setState({ collaborators: filterCollab });
  };
  
  render() {
    return (
      <div className={this.props.noteListView ? "listView" : "gridView"}>
        <div style={{ width: this.state.noteListView }}>
          <Card
            id="notesCard"
            style={{ backgroundColor: this.state.noteColor }}
          >
            <CardContent className="cardRowNote">
              <Typography color="textSecondary">
                <InputBase
                  placeholder="Title"
                  value={this.state.title}
                  onClick={this.onClickTitle}
                />
              </Typography>
              <Typography>
                <InputBase
                  placeholder="Take a note..."
                  value={this.state.description}
                  onClick={this.onClickNote}
                />
              </Typography>
              <div>
                <ul className="list_ul">
                  {this.state.list.map((element) => {
                    return (
                      <li>
                        <Checkbox
                          defaultChecked
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                        <InputBase
                          value={element.itemName}
                          inputProps={{ "aria-label": "naked" }}
                        />
                        <IconButton>
                          <HighlightOffIcon />
                        </IconButton>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div
                className="addReminderMain"
                style={{ display: this.state.reminderDisplay }}
              >
                {/* <IconButton style={{cursor:"none"}}> */}
                <AccessAlarmsIcon />
                {/* </IconButton> */}
                {this.state.reminderMsg.substring(0, 11)}
                <IconButton onClick={this.reminderClose}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
              <div className="lableInNote">
                {this.state.noteLabels.map((ele, index) => {
                  return (
                    <div>
                      <div>{ele.label}</div>
                      <IconButton size="small">
                        <HighlightOffIcon
                          onClick={(e) =>
                            this.removeLabeFromNote(ele.id, index)
                          }
                        />
                      </IconButton>
                    </div>
                  );
                })}
              </div>

              <div className="collabAtNote">
                {this.state.collaborators.map((collab) => {
                  return <div>{collab.firstName.charAt(0)}</div>;
                })}
              </div>
            </CardContent>
            <CardActions>
              <div className="cardActions">
                <div className="subCard_buttonsLeft">
                  <IconButton onClick={this.remiderHandler}>
                    <AddAlertIcon />
                  </IconButton>
                  <Menu
                    className="reminderMenu"
                    style={{
                      top: "50px",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    anchorEl={this.state.NoteReminderMenuAnchor}
                    keepMounted
                    open={this.state.NoteReminderMenuOpen}
                    onClose={this.remiderHandler}
                  >
                    <div
                      style={{
                        display: this.state.displayReminder,
                      }}
                    >
                      <li className="reminderHeading">Reminder</li>
                      <MenuItem time="0" onClick={this.setReminderOnclick}>
                        Later today 8:00 PM
                      </MenuItem>
                      <MenuItem time="1" onClick={this.setReminderOnclick}>
                        Tomorrow 8:00 AM
                      </MenuItem>
                      <MenuItem time="7" onClick={this.setReminderOnclick}>
                        Next Week 8:00 AM
                      </MenuItem>
                      <MenuItem onClick={this.clickPickDate}>
                        <WatchLaterIcon />
                        Pick date & time
                      </MenuItem>
                    </div>
                    <div
                      id="datePickBox"
                      style={{
                        display: this.state.displayDatePick,
                      }}
                    >
                      <Typography onClick={this.clickPickDate}>
                        <ArrowBackIcon />
                        Pick Date & Time
                      </Typography>
                      <TextField
                        id="date"
                        type="date"
                        onChange={this.handleChangeDate}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id={this.state.noteData.id}
                        select
                        label="Time"
                        value='morning8:00AM'
                        // onChange={this.handleChangeTime}
                        helperText="Please select your time"
                      >
                        {this.timing.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button onClick={this.setReminderOnclick}>Save</Button>
                    </div>
                  </Menu>
                  <Collaborator
                    noteData={this.state.noteData}
                    collaborators={this.state.collaborators}
                    clickOnUser={this.clickOnUser.bind(this)}
                    removeCollab={this.removeCollab.bind(this)}
                  />
                  <ColorBox changeColor={this.onClickChanageColor} />
                  <IconButton>
                    <AddPhotoAlternateIcon />
                  </IconButton>

                  <IconButton onClick={this.onClickArchive}>
                    {this.state.isArchive ? <UnarchiveIcon /> : <ArchiveIcon />}
                  </IconButton>

                  <IconButton onClick={this.moreMenuHandler}>
                    <MoreVertIcon />
                  </IconButton>
                  <div className="subNotesMoreMenuMain">
                  <Menu
                    className="subNotesMoreMenu"
                    style={{
                      top: "50px",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    anchorEl={this.state.MoreMenuAnchor}
                    keepMounted
                    open={this.state.MoreMenuOpen}
                    onClose={this.moreMenuHandler}
                  >
                    {this.state.noteDelete ? (
                      <div>
                        <MenuItem onClick={this.noteDeleteForever}>
                          DeleteForever
                        </MenuItem>
                        <MenuItem
                          onClick={(e) => {
                            this.noteDeleteRestore(e, false);
                          }}
                        >
                          Restore
                        </MenuItem>
                      </div>
                    ) : (
                      <div>
                        <MenuItem
                          onClick={(e) => {
                            this.noteDeleteRestore(e, true);
                          }}
                        >
                          Delete
                        </MenuItem>
                        <AddLabelSubNote
                          noteData={this.state.noteData}
                          addNoteLabelTemporary={this.addNoteLabelTemporary}
                          noteRefresh={this.state.noteRefresh}
                        />
                        <MenuItem
                          onClick={(e) => {
                            this.props.containerRendering(this.state.noteData,'queAndAns');
                          }}
                        > {this.state.askedQuesion?'Show Question':'Ask Question'}</MenuItem>
                      </div>
                    )}
                  </Menu>
                  </div>
                </div>
                {/* <div className="card_buttonsRight">
                      <Button>
                        close
                      </Button>
                    </div> */}
              </div>
            </CardActions>
            <Divider />
            <div className={this.state.askedQuesion === ''?'noteQuesionHide':'noteQuesion'} >
              <div>
                Question Asked
              </div>
              <div>
                {this.state.askedQuesion}
              </div>
            </div>

          </Card>

          <div>
            <Dialog
              open={this.state.dialogBoxOpen}
              onClose={this.handelNoteDialogBox}
            >
              {/* <DialogContent> */}
              <Card style={{ backgroundColor: this.state.noteColor }}>
                <CardContent>
                  <Typography color="textSecondary">
                    <InputBase
                      placeholder="Title"
                      value={this.state.title}
                      onChange={this.onChangeTitle}
                    />
                  </Typography>
                  <Typography>
                    <InputBase
                      placeholder="Take a note..."
                      value={this.state.description}
                      onChange={this.onChangeDescription}
                    />
                  </Typography>
                  <div
                    className="addReminderMain"
                    style={{ display: this.state.reminderDisplay }}
                  >
                    {/* <IconButton style={{cursor:"none"}}> */}
                    <AccessAlarmsIcon />
                    {/* </IconButton> */}
                    {this.state.reminderMsg.substring(0, 11)}
                    <IconButton onClick={this.reminderClose}>
                      <HighlightOffIcon />
                    </IconButton>
                  </div>
                </CardContent>
                <CardActions>
                  <div className="cardActionsEdit">
                    <div className="buttonsLeftDialogBox">
                      <IconButton onClick={this.remiderHandler}>
                        <AddAlertIcon />
                      </IconButton>
                      <Menu
                        className="reminderMenu"
                        style={{
                          top: "50px",
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        anchorEl={this.state.NoteReminderMenuAnchor}
                        keepMounted
                        open={this.state.NoteReminderMenuOpen}
                        onClose={this.remiderHandler}
                      >
                        <div
                          style={{
                            display: this.state.displayReminder,
                          }}
                        >
                          <li className="reminderHeading">Reminder</li>
                          <MenuItem time="0" onClick={this.setReminderOnclick}>
                            Later today 8:00 PM
                          </MenuItem>
                          <MenuItem time="1" onClick={this.setReminderOnclick}>
                            Tomorrow 8:00 AM
                          </MenuItem>
                          <MenuItem time="7" onClick={this.setReminderOnclick}>
                            Next Week 8:00 AM
                          </MenuItem>
                          <MenuItem onClick={this.clickPickDate}>
                            <WatchLaterIcon />
                            Pick date & time
                          </MenuItem>
                        </div>
                        <div
                          id="datePickBox"
                          style={{
                            display: this.state.displayDatePick,
                          }}
                        >
                          <Typography onClick={this.clickPickDate}>
                            <ArrowBackIcon />
                            Pick Date & Time
                          </Typography>
                          <TextField
                            id="date"
                            type="date"
                            onChange={this.handleChangeDate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            id={this.state.noteData.id}
                            select
                            label="Time"
                            value='morning8:00AM'
                            // onChange={this.handleChangeTime}
                            helperText="Please select your time"
                          >
                            {this.timing.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <Button onClick={this.setReminderOnclick}>
                            Save
                          </Button>
                        </div>
                      </Menu>
                      <IconButton>
                        <PersonAddIcon />
                      </IconButton>
                      <IconButton>
                        <ColorLensIcon />
                      </IconButton>
                      <IconButton>
                        <AddPhotoAlternateIcon />
                      </IconButton>
                      <IconButton>
                        <ArchiveIcon />
                      </IconButton>

                      <IconButton onClick={this.moreMenuHandler}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        className="subNotesMoreMenu"
                        style={{
                          top: "50px",
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        anchorEl={this.state.MoreMenuAnchor}
                        keepMounted
                        open={this.state.MoreMenuOpen}
                        onClose={this.moreMenuHandler}
                      >
                        <MenuItem onClick={this.noteDeleteRestore}>
                          Delete
                        </MenuItem>
                        <AddLabelSubNote />
                        <MenuItem>Show checkboxes</MenuItem>
                      </Menu>
                    </div>
                    <div className="card_buttonsRight">
                      <Button onClick={this.updateNoteClick}>close</Button>
                    </div>
                  </div>
                </CardActions>
              </Card>
            </Dialog>
          </div>
          {/* </UserConsumer> */}
        </div>
      </div>
    );
  }
}
export default Notes;
