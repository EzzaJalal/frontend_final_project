import '../assets/css/home.css';
import homeImage from '../assets/img/home.jpg';

function Home() {
    return (
        <div className="home">
            <h1>Welcome to Personal Fitness Station</h1>
            <p>"Strength in Every Rep, Power in Every Step!"</p>
            <img src={homeImage} alt="Personal Trainer App" />
        </div>
    )
}

export default Home