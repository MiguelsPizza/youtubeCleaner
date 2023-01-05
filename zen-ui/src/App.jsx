import { useState, useRef, useEffect } from 'react'
import './app.css'




const App = () => {
  const [toggle, setToggle] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [count, setCount] = useState(0)
  const [invalidKey, setInvalidKey] = useState(false)
  const ref = useRef()
  useEffect(() => {
    // Check if the key exists in the extension storage
    browser.storage.local.get('key').then((result) => {
      if (!result.key) {
        // Key does not exist, so we set the state to null
        setApiKey(null);
      } else {
        // Key exists, so we set the state with the stored key
        setApiKey(result.key);
      }
    });
  }, []);

  useEffect(() => browser.storage.local.set({ toggle }), [toggle])


  const handleSubmit = async event => {
    event.preventDefault();
    const key = event?.target?.password?.value;

    try {
      const embedding = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify(
          {
            "input": 'test',
            "model": "text-embedding-ada-002"
          }
        ),
      })
      if (embedding.status === 200) {
        browser.storage.local.set({ key });
        setApiKey(key);
        setInvalidKey(false);
      }
    } catch (error) {
      console.error(error);
      return
    }

  };

  return (
    <div>
      <div
        className={`slider-container ${toggle ? 'on' : 'off'}`}
        id="mySlider"
        onClick={() => setToggle(curr => !curr)}
      >
        <div className="slider"></div>
      </div>
      <h1>{apiKey ? 'Current Token Is Valid' : 'current API Token is not valid, please get one from openAI'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Key:
          <input ref={ref} type="password" name="password" />
        </label>
        <button type="submit">Save</button>
      </form>
      {invalidKey && <p>Invalid key</p>}
    </div>
  );
};
export default App
