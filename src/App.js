import React, { useState } from 'react';
import loader from './loader.svg'
import defaultAvatar from './defaultAvatar.png'
import './App.css';

function App() {  

  const [error, setError] = useState({isError: false, errorMessage: ""});
  const [isLoaded, setIsLoaded] = useState(true);
  const [memberSearchInput, setMemberSearchInput] = useState("");
  const [memberInfo, setMemberInfo] = useState({})
  const [isUserFound, setIsUserFound] = useState(true)

  function fetchMember(e) {
    e.preventDefault()

    setIsLoaded(false)
    setIsUserFound(true)
    
    let githubApiUrl = "https://api.github.com/search/users?q="
    let memberSearchUrl = `${githubApiUrl}${memberSearchInput}`
    
    fetch(memberSearchUrl)
    .then(function(response) {
      if (!response.ok) {
          handleError(response)
      } else {
        setError({isError: false, errorMessage: ""})
      }
      return response 
    })
    .then(response => response.json())
    .then((result) => handleResult(result))

    setIsLoaded(true)
  }

  function handleError(response) {
    switch(response.status) {
      case 403 :
        setError({isError: true, errorMessage: "Too many requests, please reload the page or wait a moment"})
        break;
      case 422 :
        setIsUserFound(false)
        break;
      default: 
      setError({isError: true, errorMessage: "An error has occured"})
    }
  }

  function handleResult(result) {
    if(result.items?.length > 0) {
      setMemberInfo(result.items[0]);
    } else {
      setIsUserFound(false)
    }
  }

  function renderMemberInfo() {
      return (
        <div>
          <h3>Member infos</h3>
          <div className="user-picture-container">
            <img className="user-picture" src={memberInfo?.avatar_url || defaultAvatar} alt="user-avatar" />
          </div>
          <div className="info-line">
            <p className="info-line-title">User type</p><p>{memberInfo?.type}</p>
          </div>
          <div className="info-line">
            <p className="info-line-title">User page</p><a href={memberInfo?.html_url} target="_blank" rel="noopener noreferrer"><p>{memberInfo.html_url}</p></a>
          </div>
        </div>
      )
  }

  function renderLoader() {
    return (
      <img className="loader" src={loader} alt="loader" />
    )
  }

  function renderUserNotFoundMessage() {
    return (
      <p className='warning'>User not found</p>
    )
  }

  function renderErrorMessage() {
    return (
    <p className='warning'>{error.errorMessage}</p>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Github user search</h1>
          <form onSubmit={e => fetchMember(e)}>
            <input value={memberSearchInput} onChange={e => setMemberSearchInput(e.target.value)} />
            <input type="submit" value="Search" />
          </form>
          <div style={{height: 50}}>{!isUserFound && renderUserNotFoundMessage()}</div>
          <div style={{height: 50}}>{error.isError && renderErrorMessage()}</div>
          {isLoaded ? renderMemberInfo() : renderLoader()}
      </header>
    </div>
  );
}

export default App;
