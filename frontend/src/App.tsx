import { useState } from 'react';
import UrlForm from './components/UrlForm';
import MetadataForm from './components/MetadataForm';

function App() {
  const [urlOutputFile, setUrlOutputFile] = useState<string | null>(null);

  return (
    <main>
            <div className="forms-container">
      <UrlForm onSuccess={setUrlOutputFile} />
      {
        urlOutputFile &&
        <MetadataForm inputFile={urlOutputFile} />
      }
      </div>
    </main>
  );
}

export default App;
