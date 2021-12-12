import * as mobilenet from "@tensorflow-models/mobilenet";
import { useEffect, useRef, useState } from "react";

function App() {
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [imageData, setImageData] = useState(null);

    const imageRef = useRef();

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            const model = await mobilenet.load();
            setModel(model);
            setIsModelLoading(false);
        } catch (error) {
            console.log(error);
            setIsModelLoading(false);
        }
    };

    const uploadImage = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            setImageURL(url);
        } else {
            setImageURL(null);
        }
    };

    useEffect(() => {
        loadModel();
    }, []);

    if (isModelLoading) {
        return <h2>Model Loading...</h2>;
    }

    const identify = async () => {
        const results = await model.classify(imageRef.current);
        setImageData(results);
    };

    return (
        <div className="App">
            <h1 className="header">Image Identification</h1>
            <div className="inputHolder">
                <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    className="uploadInput"
                    onChange={uploadImage}
                />
            </div>
            {imageURL && (
                <div className="mainWrapper">
                    <div className="mainContent">
                        <div className="imageHolder">
                            <img
                                src={imageURL}
                                alt="Upload preview"
                                crossOrigin="anonymous"
                                ref={imageRef}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </div>
                    <button onClick={identify} className="button">
                        Identify Image
                    </button>
                    <h1>Image Data</h1>
                    {imageData &&
                        imageData.map((item) => (
                            <div className="result">
                                <p>
                                    {item.className} - {item.probability}%
                                </p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default App;
