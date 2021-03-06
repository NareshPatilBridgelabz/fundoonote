import React from 'react'
import Button from '@material-ui/core/Button';
import { Divider, Typography, IconButton } from "@material-ui/core";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import UndoIcon from '@material-ui/icons/Undo';
import {askQuesion} from '../services/noteServices'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import RatingStart from './ratingStart'
import {replyQuestion} from '../services/noteServices'
import {ratingQuestion} from '../services/noteServices'
import {likeQuestion} from '../services/noteServices'

export default class QueAndAns extends React.Component {
  constructor(props) {
    super(props)
    this.state={
        open:false,
        editorState: EditorState.createEmpty(),
        question:false,
        questionMsg:'',
        chatTime:'',
        reply:false,
        parentId:'',
        rating: 0,
        like:'',
        replyList:[]
    }
  }
  componentWillMount = () => {
    this.clickShowMsgHideEditor()
  }
  onChnageRating = (rate) => {
    this.setState({rating:rate})
    ratingQuestion(rate,this.state.parentId)
  }

  onEditorStateChange = (editorState) => {
    this.setState({editorState,})
  }
  onClickQueAns = () => {
    askQuesion(this.state.editorState.getCurrentContent().getPlainText('\u0001'),this.props.noteData.id).then(res => {
      
      this.setState({questionMsg:res.data.data.details.message})
      this.setState({parentId:res.data.data.details.id})
      this.setState({chatTime:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(res.data.data.details.createdDate))})
      this.setState({question:true})
      this.setState({editorState: EditorState.createEmpty()})
    })
    this.props.userNoteRefresh()
  }
  clickShowMsgHideEditor = () => {
    if(this.props.noteData.questionAndAnswerNotes.length > 0){
      this.setState({chatTime:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(this.props.noteData.questionAndAnswerNotes[0].createdDate))})
      this.setState({questionMsg:this.props.noteData.questionAndAnswerNotes[0].message})
      this.setState({parentId:this.props.noteData.questionAndAnswerNotes[0].id})
      if(this.props.noteData.questionAndAnswerNotes[0].rate.length > 0){
        this.setState({rating:this.props.noteData.questionAndAnswerNotes[0].rate[0].rate})
      }
      if(this.props.noteData.questionAndAnswerNotes[0].like.length > 0){
        this.setState({like:this.props.noteData.questionAndAnswerNotes[0].like[0].like})
      } 
      this.setState({replyList:this.props.noteData.questionAndAnswerNotes})
      this.setState({question:true})
    }
  }
  replyOfAnswer = () => {
    replyQuestion(this.state.editorState.getCurrentContent().getPlainText('\u0001'),this.state.parentId).then(res => {
      this.state.replyList.push(res.data.data.details)
      this.setState({replyList:this.state.replyList})
      this.setState({editorState: EditorState.createEmpty()})
    })
    this.setState({reply:!this.state.reply})
  }
  likeQuestion = () => {
    likeQuestion(!this.state.like,this.state.parentId).then(res => {
      this.setState({like:!this.state.like})
    })
  }
  likeReply(likeDt,replyId){
    likeQuestion(likeDt,replyId).then(res => {
      let replyFilList = this.state.replyList.map(reply => {
        if(reply.id === replyId){
          if(reply.like.length){
            let dt = Object.assign({},reply,{
              like:[{userId: reply.id, like: likeDt}]
            })
            return dt
          }else{
            let dt = Object.assign({},reply,{
              like: [{userId: replyId, like: likeDt}]
            })
            return dt
          }
        }else{
          return reply
        }
      })
      this.setState({replyList:replyFilList})
    })
  }
  render() {
    return (
      <div>
          <div className='queAnsDialog'>
            <div className='queAndAnsNoteData'>
            <div className='queAnsTitle fontWeight-600'>
                <div>
                    {this.props.noteData.title}
                </div>
                <div>
                   <Button onClick={e => this.props.containerRendering('','createnote')}>
                       Close
                    </Button> 
                </div>
            </div>
            <div className='fontWeight-600'>
                {this.props.noteData.description}
            </div>
            </div>
            <div className={this.state.question?'hide':'show'} >
            <Editor
              editorState={this.state.editorState}
              placeholder="enter question"
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange}
            />
            <div id='askBtn'>
                <Button variant="contained" color='primary' onClick={e => this.onClickQueAns()}>
                      Ask
                </Button>
            </div>  
              </div>
            
          </div>
          <Divider/>
          <div className={this.state.question?'show margin-20px':'hide'}>
            <div className='queAnsHeader'>
              <div>
                <h5>{this.state.chatTime}</h5>
              </div>
              <div className='ratingRight'>
                <IconButton onClick={e => this.setState({reply:!this.state.reply})}>
                  <UndoIcon />
                </IconButton>
                <IconButton onClick={this.likeQuestion}>
                  {this.state.like?<ThumbUpAltIcon color='primary'/>:<ThumbUpAltIcon />}
                </IconButton>
                <IconButton onClick={this.likeQuestion}>
                  {this.state.like?<ThumbDownAltIcon />:<ThumbDownAltIcon color='primary'/>}
                </IconButton>
                <RatingStart rate={{rating:this.state.rating,onChnageRating:this.onChnageRating.bind(this)}}/>
                
              </div>
            </div>
            <div className='questionList'>
              <Typography variant='h5'>{this.state.questionMsg}</Typography>
            </div>
          </div>
          {this.state.replyList.map(reply => {
            return (<div className={this.state.question?'show margin-20px':'hide'}>
              <Divider />
              <div className='replyHeader'>
                <div>
                  <h5>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(reply.createdDate))}</h5>
                </div>
                <div className='ratingRight'>
                  {/* <IconButton onClick={e => this.setState({reply:!this.state.reply})}>
                    <UndoIcon />
                  </IconButton> */}
                  <IconButton onClick={e => this.likeReply(reply.like.length?!reply.like[0].like:true,reply.id)}>
                    {reply.like.length?reply.like[0].like?<ThumbUpAltIcon color='primary'/>:<ThumbUpAltIcon />:<ThumbUpAltIcon />}
                  </IconButton>
                  <IconButton onClick={e => this.likeReply(reply.like.length?!reply.like[0].like:true,reply.id)}>
                    {reply.like.length?reply.like[0].like?<ThumbDownAltIcon />:<ThumbDownAltIcon color='primary'/>:<ThumbDownAltIcon />}
                  </IconButton>

                  {/* <IconButton onClick={e => this.likeReply(reply.like.length?!reply.like[0].like:true,reply.id)}>
                    <ThumbUpAltIcon color={this.state.like?'primary':'default'} />
                  </IconButton> */}
                  {/* <RatingStart rate={{rating:this.state.rating,onChnageRating:this.onChnageRating.bind(this)}}/> */}
                  
                </div>
              </div>
              <div className='replyList'>
                <Typography variant='h5'>{reply.message}</Typography>
              </div>
            </div>)
          })}
          <Divider/>
          <div className={this.state.reply?'show margin-20px':'hide'} >
            <Editor
              editorState={this.state.editorState}
              placeholder="enter your reply"
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange}
            />
            <div id='askBtn'>
                <Button variant="contained" color='primary' onClick={e => this.replyOfAnswer()}>
                      Reply
                </Button>
            </div>  
          </div>
      </div>
    )
  }
}