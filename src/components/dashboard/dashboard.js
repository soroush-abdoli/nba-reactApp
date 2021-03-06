import React,{Component} from "react";
import FormFields from "../widgets/formfields/from_fields";
import {Editor} from "react-draft-wysiwyg";
import {EditorState, covertFromRaw, convertToRaw } from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {firebaseTeams,firebaseArticles,firebase} from "../../firebase";
import Uploader from "../widgets/fileUploader/file_uploader";
 
class Dashboard extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        postError:'',
        loading:false,
        formdata:{
            author:{
                element:'input',
                value:"",
                config:{
                   name:"author_input",
                   type:"text",
                   placeholder:"Enter your name" 
                },
                validation:{
                   required:true,
                },
                valid:false,
                touched:false,
                validationMessage:""  
             },
             title:{
                element:'input',
                value:"",
                config:{
                   name:"title_input",
                   type:"text",
                   placeholder:"Enter the title" 
                },
                validation:{
                   required:true,
                },
                valid:false,
                touched:false,
                validationMessage:""  
             },
             body:{
                 element:"texteditor",
                 value:'',
                 valid:true
             },
             team:{
                element:'select',
                value:"",
                config:{
                   name:"teams_input",
                   options:[],                  
                },
                validation:{
                   required:true,
                },
                valid:false,
                touched:false,
                validationMessage:""  
             },
             image:{
                element:"image",
                value:'',
                valid:true
            },
        }
    }

    componentDidMount(){
        this.loadTeams()
    }

    loadTeams = () => {
        firebaseTeams.once("value")
        .then((snapshot)=>{
            let team = [];
            snapshot.forEach((childSnapshot)=>{
               team.push({
                   id:childSnapshot.val().teamId,
                   name:childSnapshot.val().city
               }) 
            })


            const newFormdata = {...this.state.formdata}
            const newElement = {...newFormdata['team']}

            newElement.config.options = team; 
            newFormdata["team"] = newElement;

            this.setState({
                formdata: newFormdata
            })

        })
    }




    updateForm = (element,content = '') => {
        const newformdata = {
            ...this.state.formdata
        }
        const newElement = {
            ...newformdata[element.id]
        }

        if(content === ""){
            newElement.value = element.e.target.value
        }else{
            newElement.value = content
        }





        // newElement.value = element.e.target.value;
        if(element.blur){
            let validData = this.validate(newElement);
            newElement.valid = validData[0];
            newElement.validationMessage = validData[1];

        }
        newElement.touched = element.blur



        newformdata[element.id] = newElement;


        console.log(newformdata)

        this.setState({
            formdata:newformdata
        })
    }



    validate = (element) => {
        let error = [true,""]; 

        if(element.validation.required){
            const valid = element.value.trim() !=="";
            const message = `${!valid ? "This field is required":""}`;
            error = !valid ? [valid,message] : error 
        }
        return error
    }

    submitButton = () => (
        this.state.loading ? "Loading..." : 
        <div style={{marginTop:"20px"}}>

           <button type="submit">Add Post</button> 
        </div>
    )


    submitForm = (e) => {
        e.preventDefault();
        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key] = this.state.formdata[key].value
        }
        for(let key in this.state.formdata){
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }

        console.log(dataToSubmit)


        if(formIsValid){
            
            this.setState({
                loading:true,
                postError:''
            })

            firebaseArticles.orderByChild("id").limitToLast(1).once("value")
            .then(snapshot=>{
                let articleId = null;
                snapshot.forEach(childSnapshot=>{
                    articleId = childSnapshot.val().id;
                })
                dataToSubmit['date'] = firebase.database.ServerValue.TIMESTAMP
                dataToSubmit['id'] = articleId + 1;
                dataToSubmit['team'] = parseInt(dataToSubmit['team'],10)
                

                firebaseArticles.push(dataToSubmit)
                .then(article => {
                    this.props.history.push(`/articles/${article.key}`)
                }).catch(e => {
                    this.setState({
                        postError:e.message
                    })
                })

            })



        }else {
            this.setState({
                postError: 'something went wrong'
            })
        }

    }

    showError = () => (
        this.state.postError !== " " ? 
            <div className="error">{this.state.postError}</div>
        : " "
    )


    onEditorStateChange = (editorState) => {

        let contentState = editorState.getCurrentContent();
        let rawState = convertToRaw(contentState);
        let html = stateToHTML(contentState)
        
        this.updateForm({id:"body"},html)

        this.setState({
            editorState
        })
    }


    storeFilename = (filename) => {
        this.updateForm({id:"image"},filename)
    }



    render(){
        return(
            <div className="postContainer">
                <form onSubmit={this.submitForm}>
                    <h2>Add Post</h2>
                    <Uploader
                        filename={(filename)=>this.storeFilename(filename)}
                    />

                    <FormFields
                        id='author'
                        formdata={this.state.formdata.author}
                        change={(element)=>this.updateForm(element)}
                    />
                    <FormFields
                        id='title'
                        formdata={this.state.formdata.title}
                        change={(element)=>this.updateForm(element)}
                    />
                    <Editor
                        editorState={this.state.editorState}
                        wrapperClassName="myEditor-wrapper"
                        editorClassName="myEditor-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                    <FormFields
                        id='team'
                        formdata={this.state.formdata.team}
                        change={(element)=>this.updateForm(element)}
                    />





                    {this.submitButton()}
                    {this.showError()}
                </form>
            </div>
        )
    }
}


export default Dashboard;