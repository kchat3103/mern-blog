import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({}); //state represents internal data of a component
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>{ //used for tracking input changes
    setFormData({...formData, [e.target.id]:e.target.value.trim() }); // ... is used to to update state while preserving the existing state.
  };
  const handleSubmit = async (e) =>{ //async because we are submitting to database which may take time
    e.preventDefault(); // to prevent default behaviour of page refresh on submission
    if(!formData.email || !formData.password){
      return setErrorMessage('Please fill out all the fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      //for submitting application
      const res = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {'Content-Type':'application/json'}, //content should be JSON
        body: JSON.stringify(formData) // cannot send JSON directly, so convert it into string
      });
      const data = await res.json(); //convert the data recieved into json and use it
      if(data.success===false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } 
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Kshitij&apos;s
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            Sign in with your email and password
            or with Google !
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' placeholder='**********' id='password' onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading?(
                  <>
                    <Spinner size = 'sm'/>
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don&apos;tHave an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign up
            </Link>
          </div>
          {
            errorMessage &&(
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
}