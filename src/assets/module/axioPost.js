import axios from 'axios';

const PostRq = (url, json)=>{
    let i = 'asdf'
    axios.post(url, json).then(info => {
        console.log(this)
    }).catch(error => {
        console.error(error);
    });
    console.log(i)
}

export default PostRq;