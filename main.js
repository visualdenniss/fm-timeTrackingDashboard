const container = document.getElementById('stats-container');
const userCard = document.getElementById('user-card')
const timeframeBtnsContainer = document.getElementById('timeframe-btns')

const timeframes = ['Daily', 'Weekly', 'Monthly']

let timeframe = timeframes[1];

const setFrame = (frame) => {
    timeframe = frame;
    renderStats(); // Call renderStats function after setting the timeframe
}

timeframes.forEach((frame)=> {
    const button = document.createElement('button');
    button.textContent = frame;
    button.addEventListener('click', () => {
        setFrame(frame)
        updateActiveButton(button);
    });
    timeframeBtnsContainer.appendChild(button);

    // Add active class to initially selected timeframe button
    if (frame === timeframe) {
        button.classList.add('active');
    }
})

const updateActiveButton = (activeButton) => {
    const buttons = timeframeBtnsContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

const renderStats = () => {

    const url = './data.json'
    // const url = 'http://localhost:8000/user/stats'
    
    fetch(url)
    .then((response)=>{
        if(!response.ok) {
            throw new Error('Oops! Something went wrong')
        }
        return response.json();
    })
    .then((data)=> {
        const user = data.user;
        // render user bio data
        appendUserBio(user)
        // Clear previous stats before rendering new ones
        container.innerHTML = "";
        //render user stats data
        user.reports.forEach((stat)=>{
            appendStat(stat, timeframe)
        })
 
    })
    .catch((error) => {
        console.error(error);
    });
}

const appendStat = (stat, timeframe) => {
    let frame; 
    let activeFrame; 

    switch (timeframe.toLowerCase()) {
        case 'daily':
            frame = stat.timeframes.daily;
            activeFrame = 'Yesterday'
            break;
        case 'weekly':
            frame = stat.timeframes.weekly;
            activeFrame = 'Last Week'
            break;
        case 'monthly':
            frame = stat.timeframes.monthly;
            activeFrame = 'Last Month'
            break;
    }

    const {path, bgColor} = getIconPath(stat.title)

    container.innerHTML += `
    <li class="stat-container" style="background-image: url('./images/${path}');background-color:${bgColor}">
        <div class="stat-data">
            <div class="stat-left">
                <h3 class="stat-title">
                    ${stat.title}
                </h3>
                <p class="stat-value">
                    ${frame.current}
                </p>
            </div>
            <div class="stat-right">
                <button><svg width="21" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#BBC0FF" fill-rule="evenodd"/></svg></button>
                <div class="stat-previous">
                    ${activeFrame} - ${frame.previous}${frame.previous < 2 ? 'hr' : 'hrs'}
                </div>
            </div>
        </div>
    </li>`
}

const appendUserBio = (user) => {
    userCard.innerHTML = `<div class="avatar">
        <img src=${user.imageUrl} alt="">
    </div>
    <div class="user-info">
        <h2>Report for</h2>
        <p>${user.name} ${user.lastName}</p>
    </div>`
}

// Initial rendering
renderStats();

function getIconPath(title) {
    let path; 
    let bgColor;
    switch (title) {
        case 'Work':
            path = "icon-work.svg";
            bgColor = "var(--light-red-work)";
            break;
        case 'Play':
            path = "icon-play.svg";
            bgColor = "var(--soft-blue-play)";
            break;
        case 'Study':
            path = "icon-study.svg";
            bgColor = "var(--light-red-study)";
            break;
        case 'Exercise':
            path = "icon-exercise.svg";
            bgColor = "var(--lime-green-exercise)";
            break;
        case 'Social':
            path = "icon-social.svg";
            bgColor = "var(--violet-social)";
            break;
        case 'Self Care':
            path = "icon-self-care.svg";
            bgColor = "var(--soft-orange-self-care)";
            break;
    }

    return {path, bgColor}
}