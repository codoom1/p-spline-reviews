document.addEventListener('DOMContentLoaded', () => {
    const filters = {
        year: 'all',
        topic: 'all'
    };

    // Filter button handlers
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.year ? 'year' : 'topic';
            const value = btn.dataset.year || btn.dataset.topic;

            // Toggle active state
            if (btn.classList.contains('active')) {
                filters[type] = 'all';
                btn.classList.remove('active');
            } else {
                // Remove active class from other buttons of same type
                document.querySelectorAll(`.filter-btn[data-${type}]`).forEach(b => b.classList.remove('active'));
                filters[type] = value;
                btn.classList.add('active');
            }

            filterPapers();
        });
    });

    function filterPapers() {
        const papers = document.querySelectorAll('.paper-entry');
        const activeYears = Array.from(document.querySelectorAll('.filter-btn[data-year].active')).map(btn => btn.dataset.year);
        const activeTopics = Array.from(document.querySelectorAll('.filter-btn[data-topic].active')).map(btn => btn.dataset.topic);
        const activeMethods = Array.from(document.querySelectorAll('.method-btn.active')).map(btn => btn.dataset.method);

        papers.forEach(paper => {
            const year = parseInt(paper.getAttribute('data-year'));
            const topic = paper.getAttribute('data-topic');
            const method = paper.getAttribute('data-method');

            const yearMatch = activeYears.length === 0 || activeYears.some(y => matchesYearFilter(year, y));
            const topicMatch = activeTopics.length === 0 || activeTopics.includes(topic);
            const methodMatch = activeMethods.length === 0 || activeMethods.includes(method);

            paper.style.display = (yearMatch && topicMatch && methodMatch) ? 'block' : 'none';
        });
    }

    function matchesYearFilter(year, filter) {
        switch(filter) {
            case '2020-present': return year >= 2020;
            case '2015-2019': return year >= 2015 && year < 2020;
            case 'pre-2015': return year < 2015;
            default: return true;
        }
    }

    // Paper comparison functionality
    const compareMode = {
        active: false,
        selected: new Set(),
        data: {
            'Flexible smoothing with B-splines and penalties': {
                methodology: 'P-splines with difference penalties',
                keyContributions: ['Introduction of P-splines', 'Efficient computation', 'Penalty selection methods'],
                impact: 'Foundational work in penalized spline smoothing',
                approach: 'spline-based'
            },
            'Asymptotic properties of penalized spline estimators': {
                methodology: 'Theoretical analysis of convergence rates',
                keyContributions: ['Asymptotic properties', 'Knot selection guidance', 'Convergence analysis'],
                impact: 'Established theoretical framework for P-splines',
                approach: 'spline-based'
            },
            'Robust and Efficient derivative estimation under correlated errors': {
                methodology: 'Robust estimation with correlation handling',
                keyContributions: ['Correlation structure estimation', 'Robust derivative estimation', 'Efficient computation'],
                impact: 'Advanced handling of correlated errors'
            },
            'Practical Smoothing: The Joys of P-splines': {
                methodology: 'Comprehensive P-spline implementation',
                keyContributions: ['Practical guidelines', 'Implementation details', 'Applications'],
                impact: 'Bridge between theory and practice'
            },
            'Bandwidth Choice and Confidence Intervals for Derivatives of Noisy Data': {
                methodology: 'Kernel-based derivative estimation with automatic bandwidth selection',
                keyContributions: ['Automatic bandwidth selection', 'Confidence interval construction', 'Finite sample analysis'],
                impact: 'Foundational work in bandwidth selection',
                approach: 'kernel-based'
            },
            'Derivative estimation based on difference sequence': {
                methodology: 'Difference sequence with local polynomial fitting',
                keyContributions: ['Novel difference sequence approach', 'Adaptive bandwidth selection', 'Local fitting'],
                impact: 'Alternative to traditional methods',
                approach: 'local-polynomial'
            }
        }
    };

    function showComparison() {
        if (compareMode.selected.size < 2) return;

        const modal = document.createElement('div');
        modal.className = 'comparison-modal';
        modal.innerHTML = `
            <div class="comparison-content">
                <h3>Method Comparison</h3>
                <div class="comparison-tabs">
                    <button class="tab-btn active" data-tab="overview">Overview</button>
                    <button class="tab-btn" data-tab="theoretical">Theoretical Properties</button>
                    <button class="tab-btn" data-tab="practical">Practical Aspects</button>
                </div>
                <div class="tab-content active" data-tab="overview">
                    ${generateOverviewComparison()}
                </div>
                <div class="tab-content" data-tab="theoretical">
                    ${generateTheoreticalComparison()}
                </div>
                <div class="tab-content" data-tab="practical">
                    ${generatePracticalComparison()}
                </div>
                <button class="close-comparison">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Tab switching functionality
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                modal.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`).classList.add('active');
            });
        });

        modal.querySelector('.close-comparison').onclick = () => modal.remove();
    }

    function generateOverviewComparison() {
        return `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Aspect</th>
                        ${Array.from(compareMode.selected).map(title => `<th>${title}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Methodology</td>
                        ${Array.from(compareMode.selected).map(title => 
                            `<td>${compareMode.data[title]?.methodology || 'Not available'}</td>`
                        ).join('')}
                    </tr>
                    <tr>
                        <td>Key Contributions</td>
                        ${Array.from(compareMode.selected).map(title => 
                            `<td>${compareMode.data[title]?.keyContributions?.join(', ') || 'Not available'}</td>`
                        ).join('')}
                    </tr>
                    <tr>
                        <td>Impact</td>
                        ${Array.from(compareMode.selected).map(title => 
                            `<td>${compareMode.data[title]?.impact || 'Not available'}</td>`
                        ).join('')}
                    </tr>
                </tbody>
            </table>
        `;
    }

    function generateTheoreticalComparison() {
        return `<p>Theoretical comparison content goes here.</p>`;
    }

    function generatePracticalComparison() {
        return `<p>Practical comparison content goes here.</p>`;
    }

    // Add method comparison functionality
    function generateMethodComparison() {
        // Deep comparison data for different methodological approaches
        const methodComparisons = {
            theoretical: {
                spline: {
                    convergence: 'Optimal rates under suitable conditions',
                    assumptions: 'Smoothness of underlying function',
                    limitations: 'Boundary effects, knot placement sensitivity'
                },
                kernel: {
                    convergence: 'Classical optimal rates',
                    assumptions: 'Kernel order, function smoothness',
                    limitations: 'Boundary bias, computational complexity'
                },
                local: {
                    convergence: 'Local adaptation capability',
                    assumptions: 'Local polynomial degree',
                    limitations: 'Variable bandwidth selection'
                }
            },
            practical: {
                spline: {
                    computation: 'Efficient matrix operations',
                    implementation: 'Standard linear algebra packages',
                    scalability: 'Good for large datasets'
                },
                kernel: {
                    computation: 'Point-wise calculations',
                    implementation: 'Direct formula application',
                    scalability: 'Computationally intensive'
                },
                local: {
                    computation: 'Local weighted regression',
                    implementation: 'Iterative procedures',
                    scalability: 'Moderate computational cost'
                }
            }
        };

        function generateTheoreticalComparison() {
            return `
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Aspect</th>
                            <th>Spline-based</th>
                            <th>Kernel-based</th>
                            <th>Local Polynomial</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Convergence</td>
                            <td>${methodComparisons.theoretical.spline.convergence}</td>
                            <td>${methodComparisons.theoretical.kernel.convergence}</td>
                            <td>${methodComparisons.theoretical.local.convergence}</td>
                        </tr>
                        <tr>
                            <td>Assumptions</td>
                            <td>${methodComparisons.theoretical.spline.assumptions}</td>
                            <td>${methodComparisons.theoretical.kernel.assumptions}</td>
                            <td>${methodComparisons.theoretical.local.assumptions}</td>
                        </tr>
                        <tr>
                            <td>Limitations</td>
                            <td>${methodComparisons.theoretical.spline.limitations}</td>
                            <td>${methodComparisons.theoretical.kernel.limitations}</td>
                            <td>${methodComparisons.theoretical.local.limitations}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        function generatePracticalComparison() {
            return `
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Aspect</th>
                            <th>Spline-based</th>
                            <th>Kernel-based</th>
                            <th>Local Polynomial</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Computation</td>
                            <td>${methodComparisons.practical.spline.computation}</td>
                            <td>${methodComparisons.practical.kernel.computation}</td>
                            <td>${methodComparisons.practical.local.computation}</td>
                        </tr>
                        <tr>
                            <td>Implementation</td>
                            <td>${methodComparisons.practical.spline.implementation}</td>
                            <td>${methodComparisons.practical.kernel.implementation}</td>
                            <td>${methodComparisons.practical.local.implementation}</td>
                        </tr>
                        <tr>
                            <td>Scalability</td>
                            <td>${methodComparisons.practical.spline.scalability}</td>
                            <td>${methodComparisons.practical.kernel.scalability}</td>
                            <td>${methodComparisons.practical.local.scalability}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        return {
            theoretical: generateTheoreticalComparison(),
            practical: generatePracticalComparison()
        };
    }

    // Method tab functionality
    document.querySelectorAll('.method-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;
            
            // Update active tab
            document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter papers
            document.querySelectorAll('.paper-entry').forEach(paper => {
                if (method === 'all' || paper.dataset.method === method) {
                    paper.style.display = 'block';
                } else {
                    paper.style.display = 'none';
                }
            });
        });
    });

    // Add method comparison button
    const compareBtn = document.createElement('button');
    compareBtn.className = 'compare-methods-btn';
    compareBtn.textContent = 'Compare Methods';
    compareBtn.onclick = () => {
        const comparisons = generateMethodComparison();
        const modal = document.createElement('div');
        modal.className = 'method-comparison-modal';
        modal.innerHTML = `
            <div class="comparison-content">
                <h3>Method Comparison</h3>
                <div class="comparison-tabs">
                    <button class="tab-btn active" data-tab="theoretical">Theoretical Properties</button>
                    <button class="tab-btn" data-tab="practical">Practical Aspects</button>
                </div>
                <div class="tab-content active" data-tab="theoretical">
                    ${comparisons.theoretical}
                </div>
                <div class="tab-content" data-tab="practical">
                    ${comparisons.practical}
                </div>
                <button class="close-comparison">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Tab switching functionality
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                modal.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`).classList.add('active');
            });
        });
        
        modal.querySelector('.close-comparison').onclick = () => modal.remove();
    };

    document.querySelector('.method-tabs').appendChild(compareBtn);

    // Timeline functionality
    let timelineVisible = false;

    function toggleTimeline() {
        const papers = Array.from(document.querySelectorAll('.paper-entry')).map(paper => ({
            title: paper.querySelector('h3').textContent,
            year: parseInt(paper.querySelector('.year').textContent),
            topic: paper.dataset.topic
        })).sort((a, b) => a.year - b.year);

        if (timelineVisible) {
            document.querySelector('.timeline-view')?.remove();
            timelineVisible = false;
            return;
        }

        const timeline = document.createElement('div');
        timeline.className = 'timeline-view';
        timeline.innerHTML = `
            <div class="timeline-header">
                <h3>Research Timeline</h3>
                <button class="close-timeline">×</button>
            </div>
            <div class="timeline-content">
                ${papers.map(paper => `
                    <div class="timeline-item" data-topic="${paper.topic}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${paper.year}</div>
                        <div class="timeline-info">
                            <h4>${paper.title}</h4>
                            <p class="timeline-topic">Category: ${paper.topic}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(timeline);
        timelineVisible = true;

        timeline.querySelector('.close-timeline').onclick = toggleTimeline;

        // Animate timeline items
        setTimeout(() => {
            timeline.querySelectorAll('.timeline-item').forEach((item, index) => {
                setTimeout(() => item.classList.add('show'), index * 100);
            });
        }, 100);
    }

    // Add timeline toggle button
    const timelineBtn = document.createElement('button');
    timelineBtn.className = 'timeline-btn';
    timelineBtn.textContent = 'View Timeline';
    timelineBtn.onclick = toggleTimeline;
    document.querySelector('.filters').appendChild(timelineBtn);

    // Add methodology filters
    const methodFilters = document.createElement('div');
    methodFilters.className = 'method-filters';
    methodFilters.innerHTML = `
        <button class="method-btn" data-method="spline">Spline-based</button>
        <button class="method-btn" data-method="kernel">Kernel-based</button>
        <button class="method-btn" data-method="local">Local Polynomial</button>
    `;
    document.querySelector('.filters').appendChild(methodFilters);

    // Method filter functionality
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            filterPapers();
        });
    });
});