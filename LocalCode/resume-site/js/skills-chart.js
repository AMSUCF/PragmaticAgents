// Skills Visualization Chart
// This creates an artistic, pastel-colored skills visualization
document.addEventListener('DOMContentLoaded', function() {
    const skillsChart = document.getElementById('skills-chart');

    if (skillsChart) {
        // Skills data with proficiency levels
        const skillsData = [
            { name: 'Adobe Illustrator', proficiency: 90, color: '#E8A5A5' },
            { name: 'Photoshop', proficiency: 85, color: '#B8E6B8' },
            { name: 'InDesign', proficiency: 80, color: '#D4B5FE' },
            { name: 'Figma', proficiency: 88, color: '#A5E8A5' },
            { name: 'HTML/CSS', proficiency: 82, color: '#E8C5A5' },
            { name: 'JavaScript', proficiency: 65, color: '#B8A5E8' },
            { name: 'QGIS', proficiency: 55, color: '#A5E8E8' },
            { name: 'Omeka', proficiency: 75, color: '#E8A5D4' }
        ];

        // Create the chart container
        skillsChart.innerHTML = '';

        // Create a grid layout for the skills
        const chartGrid = document.createElement('div');
        chartGrid.style.display = 'grid';
        chartGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
        chartGrid.style.gap = '15px';
        chartGrid.style.width = '100%';
        chartGrid.style.height = '100%';

        // Add each skill as a colored bar
        skillsData.forEach(skill => {
            const skillContainer = document.createElement('div');
            skillContainer.style.display = 'flex';
            skillContainer.style.flexDirection = 'column';
            skillContainer.style.alignItems = 'center';
            skillContainer.style.justifyContent = 'flex-end';
            skillContainer.style.height = '100%';

            const skillBar = document.createElement('div');
            skillBar.style.width = '80%';
            skillBar.style.height = `${skill.proficiency}%`;
            skillBar.style.backgroundColor = skill.color;
            skillBar.style.borderRadius = '8px 8px 0 0';
            skillBar.style.transition = 'height 1.5s ease';
            skillBar.style.marginBottom = '8px';

            const skillLabel = document.createElement('div');
            skillLabel.style.fontSize = '0.8em';
            skillLabel.style.fontWeight = 'bold';
            skillLabel.style.color = '#555';
            skillLabel.style.textAlign = 'center';
            skillLabel.style.padding = '5px';
            skillLabel.textContent = skill.name;

            skillContainer.appendChild(skillBar);
            skillContainer.appendChild(skillLabel);
            chartGrid.appendChild(skillContainer);
        });

        skillsChart.appendChild(chartGrid);

        // Add a title
        const title = document.createElement('div');
        title.style.textAlign = 'center';
        title.style.fontSize = '1.2em';
        title.style.fontWeight = 'bold';
        title.style.color = '#6B8E98';
        title.style.marginBottom = '15px';
        title.textContent = 'Proficiency Levels';

        skillsChart.insertBefore(title, chartGrid);
    }
});