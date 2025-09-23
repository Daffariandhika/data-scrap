import { useState } from 'react';
import { UrlForm, MetadataForm, Agreement } from './components';

function App() {
  const [urlOutputFile, setUrlOutputFile] = useState<string | null>(null);

  return (
    <main>
      <div className="page-container">
        <UrlForm onSuccess={setUrlOutputFile} />
        <MetadataForm inputFile={urlOutputFile || "list"} />
        <Agreement />
      </div>
    </main>
  );
}

export default App;
