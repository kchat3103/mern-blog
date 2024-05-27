import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //to show the progress of file being uploaded
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const filePickerRef = useRef(); //for uploading image by clicking on profile
  const hanldeImageChange = (e) =>{
    const file = e.target.files[0]; //files[0] indicates first file
    if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file)); //create an accessible url for this file
    }
  };
  useEffect(()=>{ //for uploading the image and it being reflected as we change it
    if(imageFile){
        uploadImage();
    }
  },[imageFile]);

  const uploadImage = async()=>{
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime()+ imageFile.name;
    const storageRef = ref(storage, fileName); // reference the storage and file name, ref is firebase function
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // get info of image while it is being uploaded
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            const progess = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setImageFileUploadProgress(progess.toFixed(0));
        },
        (error) =>{
            setImageFileUploadError('Could not upload image (File size must be less than 2MB)')
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                setImageFileUrl(downloadURL)
            });
        }
    ); 
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={hanldeImageChange} ref = {filePickerRef} hidden/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
        {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'
              }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
        />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}