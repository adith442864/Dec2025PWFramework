// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// ============================================
// Flow: lint → dev → qa → stage → prod (automatic)
// Trigger: Push, PR, or manual build
// Reports: Separate Allure per environment, Playwright HTML, Custom HTML
// ============================================

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        NODE_VERSION = '20'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.cache/ms-playwright"
        SLACK_WEBHOOK_URL = credentials('slack-webhook')

        // Email recipients
        EMAIL_RECIPIENTS = 'adithautomation@gmail.com, mail@adithautomation.com'

        // ⭐ FIX FOR ARM64 (Prevents Puppeteer Chromium download)
        PUPPETEER_SKIP_DOWNLOAD = 'true'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ============================================
        // 🔍 ESLint Analysis
        // ============================================
        stage('🔍 ESLint Analysis') {
            steps {
                echo '============================================'
                echo '📥 Installing dependencies...'
                echo '============================================'
                sh 'npm ci'

                echo '============================================'
                echo '📁 Creating ESLint report directory...'
                echo '============================================'
                sh 'mkdir -p eslint-report'

                echo '============================================'
                echo '🔍 Running ESLint...'
                echo '============================================'
                script {
                    def eslintStatus = sh(script: 'npm run lint', returnStatus: true)
                    env.ESLINT_STATUS = eslintStatus == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '📊 Generating ESLint HTML Report...'
                echo '============================================'
                sh 'npm run lint:report || true'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'eslint-report',
                        reportFiles: 'index.html',
                        reportName: 'ESLint Report',
                        reportTitles: 'ESLint Analysis'
                    ])
                    script {
                        if (env.ESLINT_STATUS == 'failure') {
                            echo '⚠️ ESLint found issues - check the HTML report'
                        } else {
                            echo '✅ No ESLint issues found'
                        }
                    }
                }
            }
        }

        // ============================================
        // 🔧 DEV Tests
        // ============================================
        stage('🔧 DEV Tests') {
            steps {
                echo '============================================'
                echo '🎭 Installing Playwright browsers...'
                echo '============================================'
                sh 'npx playwright install --with-deps chromium'

                echo '============================================'
                echo '🧹 Cleaning previous results...'
                echo '============================================'
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'

                echo '============================================'
                echo '🧪 Running DEV tests...'
                echo '============================================'
                script {
                    env.DEV_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.dev.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '🏷️ Adding Allure environment info...'
                echo '============================================'
                sh '''
                    mkdir -p allure-results
                    echo "Environment=DEV" > allure-results/environment.properties
                    echo "Browser=Google Chrome" >> allure-results/environment.properties
                    echo "Config=playwright.config.dev.ts" >> allure-results/environment.properties
                '''
            }
            post {
                always {
                    sh '''
                        mkdir -p allure-results-dev
                        cp -r allure-results/* allure-results-dev/ 2>/dev/null || true
                        npx allure generate allure-results-dev --clean -o allure-report-dev || true
                    '''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-dev',
                        reportFiles: 'index.html',
                        reportName: 'DEV Allure Report'
                    ])
                    publishHTML(target: [
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV Playwright Report',
                        alwaysLinkToLastBuild: true,
                        keepAll: true
                    ])
                    publishHTML(target: [
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV HTML Report',
                        alwaysLinkToLastBuild: true,
                        keepAll: true
                    ])

                    archiveArtifacts artifacts: 'allure-results-dev/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // 🔍 QA Tests
        // ============================================
        stage('🔍 QA Tests') {
            steps {
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'
                script {
                    env.QA_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.qa.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                sh '''
                    mkdir -p allure-results
                    echo "Environment=QA" > allure-results/environment.properties
                    echo "Browser=Google Chrome" >> allure-results/environment.properties
                    echo "Config=playwright.config.qa.ts" >> allure-results/environment.properties
                '''
            }
            post {
                always {
                    sh '''
                        mkdir -p allure-results-qa
                        cp -r allure-results/* allure-results-qa/ 2>/dev/null || true
                        npx allure generate allure-results-qa --clean -o allure-report-qa || true
                    '''

                    publishHTML(target: [
                        reportDir: 'allure-report-qa',
                        reportFiles: 'index.html',
                        reportName: 'QA Allure Report',
                        alwaysLinkToLastBuild: true,
                        keepAll: true
                    ])
                }
            }
        }

        // ============================================
        // 🎯 STAGE Tests
        // ============================================
        stage('🎯 STAGE Tests') {
            steps {
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'
                script {
                    env.STAGE_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.stage.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                sh '''
                    mkdir -p allure-results
                    echo "Environment=STAGE" > allure-results/environment.properties
                    echo "Browser=Google Chrome" >> allure-results/environment.properties
                    echo "Config=playwright.config.stage.ts" >> allure-results/environment.properties
                '''
            }
            post {
                always {
                    sh '''
                        mkdir -p allure-results-stage
                        cp -r allure-results/* allure-results-stage/ 2>/dev/null || true
                        npx allure generate allure-results-stage --clean -o allure-report-stage || true
                    '''

                    publishHTML(target: [
                        reportDir: 'allure-report-stage',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Allure Report',
                        alwaysLinkToLastBuild: true,
                        keepAll: true
                    ])
                }
            }
        }

        // ============================================
        // 🚀 PROD Tests
        // ============================================
        stage('🚀 PROD Tests') {
            steps {
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'
                script {
                    env.PROD_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.prod.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                sh '''
                    mkdir -p allure-results
                    echo "Environment=PROD" > allure-results/environment.properties
                    echo "Browser=Google Chrome" >> allure-results/environment.properties
                    echo "Config=playwright.config.prod.ts" >> allure-results/environment.properties
                '''
            }
            post {
                always {
                    sh '''
                        mkdir -p allure-results-prod
                        cp -r allure-results/* allure-results-prod/ || true
                        npx allure generate allure-results-prod --clean -o allure-report-prod || true
                    '''

                    publishHTML(target: [
                        reportDir: 'allure-report-prod',
                        reportFiles: 'index.html',
                        reportName: 'PROD Allure Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ============================================
        // 📈 Combined Allure Report
        // ============================================
        stage('📈 Combined Allure Report') {
            steps {
                sh '''
                    mkdir -p allure-results-combined
                    cp -r allure-results-dev/* allure-results-combined/ || true
                    cp -r allure-results-qa/* allure-results-combined/ || true
                    cp -r allure-results-stage/* allure-results-combined/ || true
                    cp -r allure-results-prod/* allure-results-combined/ || true

                    echo "Environment=ALL" > allure-results-combined/environment.properties
                    echo "Browser=Google Chrome" >> allure-results-combined/environment.properties
                '''
            }
            post {
                always {
                    allure([
                        includeProperties: true,
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results-combined']]
                    ])
                }
            }
        }
    }

    // ============================================
    // POST ACTIONS (Slack + Email)
    // ============================================
    post {
        always {
            echo "--------- PIPELINE SUMMARY ----------"
        }
        failure {
            echo "❌ Pipeline failed!"
            slackSend(color: 'danger', message: "❌ Playwright Pipeline Failed - ${env.JOB_NAME}")
        }
        success {
            echo "✅ Pipeline succeeded!"
            slackSend(color: 'good', message: "✅ Playwright Pipeline Passed - ${env.JOB_NAME}")
        }
    }
}
