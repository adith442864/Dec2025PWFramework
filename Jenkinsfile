// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// ============================================
// Flow: lint → dev → qa → stage → prod (automatic)
// Trigger: Push, PR, or manual build
// Reports: Separate Allure per environment, Playwright HTML, Custom HTML
// ✅ ESLint static code analysis
// ✅ Separate Allure reports per environment
// ✅ Slack notifications for test results
// ✅ Email notifications with all report links
// ============================================
//
// Required Jenkins Credentials:
// ------------------------------------
// slack-token          - Slack Webhook Token (Secret text)
// ============================================
//
// Required Jenkins Plugins:
// ------------------------------------
// - NodeJS Plugin
// - Allure Jenkins Plugin
// - HTML Publisher Plugin
// - Slack Notification Plugin
// - Email Extension Plugin
// - Pipeline Stage View Plugin
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
        EMAIL_RECIPIENTS = 'adithautomation@gmail.com, mail@adithautomation.com'

        // Prevent Puppeteer from trying to download Chromium on arm64
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
        // Static Code Analysis (ESLint) + Install browsers
        // ============================================
        stage('ESLint Analysis') {
            steps {
                echo '============================================'
                echo '📥 Installing dependencies (npm ci)...'
                echo '============================================'
                sh 'npm ci'

                echo '============================================'
                echo '🌐 Installing Playwright Chrome browser...'
                echo '============================================'
                // Needed because your configs use channel: "chrome"
                sh 'npx playwright install chrome'

                echo '============================================'
                echo '📁 Creating ESLint report directory...'
                echo '============================================'
                sh 'mkdir -p eslint-report'

                echo '============================================'
                echo '🔍 Running ESLint...'
                echo '============================================'
                script {
                    def eslintStatus = sh(
                        script: 'npm run lint',
                        returnStatus: true
                    )
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
        // DEV Environment Tests
        // ============================================
        stage('DEV Tests') {
            steps {
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
                echo '🏷️ Adding Allure environment info (DEV)...'
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
                        reportName: 'DEV Allure Report',
                        reportTitles: 'DEV Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV Playwright Report',
                        reportTitles: 'DEV Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV HTML Report',
                        reportTitles: 'DEV Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-dev/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // QA Environment Tests
        // ============================================
        stage('QA Tests') {
            steps {
                echo '============================================'
                echo '🧹 Cleaning previous results...'
                echo '============================================'
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'

                echo '============================================'
                echo '🧪 Running QA tests...'
                echo '============================================'
                script {
                    env.QA_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.qa.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '🏷️ Adding Allure environment info (QA)...'
                echo '============================================'
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
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-qa',
                        reportFiles: 'index.html',
                        reportName: 'QA Allure Report',
                        reportTitles: 'QA Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'QA Playwright Report',
                        reportTitles: 'QA Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'QA HTML Report',
                        reportTitles: 'QA Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-qa/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // STAGE Environment Tests
        // ============================================
        stage('STAGE Tests') {
            steps {
                echo '============================================'
                echo '🧹 Cleaning previous results...'
                echo '============================================'
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'

                echo '============================================'
                echo '🧪 Running STAGE tests...'
                echo '============================================'
                script {
                    env.STAGE_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.stage.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '🏷️ Adding Allure environment info (STAGE)...'
                echo '============================================'
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
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-stage',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Allure Report',
                        reportTitles: 'STAGE Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Playwright Report',
                        reportTitles: 'STAGE Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'STAGE HTML Report',
                        reportTitles: 'STAGE Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-stage/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // PROD Environment Tests
        // ============================================
        stage('PROD Tests') {
            steps {
                echo '============================================'
                echo '🧹 Cleaning previous results...'
                echo '============================================'
                sh 'rm -rf allure-results playwright-report playwright-html-report test-results'

                echo '============================================'
                echo '🧪 Running PROD tests...'
                echo '============================================'
                script {
                    env.PROD_TEST_STATUS = sh(
                        script: 'npx playwright test --grep "@login" --config=playwright.config.prod.ts',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '🏷️ Adding Allure environment info (PROD)...'
                echo '============================================'
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
                        cp -r allure-results/* allure-results-prod/ 2>/dev/null || true
                        npx allure generate allure-results-prod --clean -o allure-report-prod || true
                    '''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-prod',
                        reportFiles: 'index.html',
                        reportName: 'PROD Allure Report',
                        reportTitles: 'PROD Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PROD Playwright Report',
                        reportTitles: 'PROD Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'PROD HTML Report',
                        reportTitles: 'PROD Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-prod/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // Combined Allure Report (HTML via npx allure)
        // ============================================
        stage('Combined Allure Report') {
            steps {
                echo '============================================'
                echo '📊 Generating Combined Allure Report (HTML)...'
                echo '============================================'

                sh '''
                    mkdir -p allure-results-combined

                    cp -r allure-results-dev/* allure-results-combined/ 2>/dev/null || true
                    cp -r allure-results-qa/* allure-results-combined/ 2>/dev/null || true
                    cp -r allure-results-stage/* allure-results-combined/ 2>/dev/null || true
                    cp -r allure-results-prod/* allure-results-combined/ 2>/dev/null || true

                    echo "Environment=ALL (DEV, QA, STAGE, PROD)" > allure-results-combined/environment.properties
                    echo "Browser=Google Chrome" >> allure-results-combined/environment.properties
                    echo "Pipeline=${JOB_NAME}" >> allure-results-combined/environment.properties
                    echo "Build=${BUILD_NUMBER}" >> allure-results-combined/environment.properties

                    npx allure generate allure-results-combined --clean -o allure-report-combined || true
                '''

                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'allure-report-combined',
                    reportFiles: 'index.html',
                    reportName: 'Combined Allure Report',
                    reportTitles: 'Combined Allure Report'
                ])
            }
        }
    }

    // ============================================
    // Post-Build Actions
    // ============================================
    post {
        always {
            echo '============================================'
            echo '📬 PIPELINE SUMMARY'
            echo '============================================'

            script {
                def devStatus   = env.DEV_TEST_STATUS   ?: 'unknown'
                def qaStatus    = env.QA_TEST_STATUS    ?: 'unknown'
                def stageStatus = env.STAGE_TEST_STATUS ?: 'unknown'
                def prodStatus  = env.PROD_TEST_STATUS  ?: 'unknown'

                def devEmoji   = devStatus   == 'success' ? '✅' : '❌'
                def qaEmoji    = qaStatus    == 'success' ? '✅' : '❌'
                def stageEmoji = stageStatus == 'success' ? '✅' : '❌'
                def prodEmoji  = prodStatus  == 'success' ? '✅' : '❌'

                echo """
============================================
📊 Test Results by Environment:
============================================
${devEmoji} DEV:   ${devStatus}
${qaEmoji} QA:    ${qaStatus}
${stageEmoji} STAGE: ${stageStatus}
${prodEmoji} PROD:  ${prodStatus}
============================================
"""

                env.DEV_EMOJI   = devEmoji
                env.QA_EMOJI    = qaEmoji
                env.STAGE_EMOJI = stageEmoji
                env.PROD_EMOJI  = prodEmoji
            }
        }

        success {
            echo '✅ Pipeline completed successfully!'

            script {
                try {
                    slackSend(
                        color: 'good',
                        message: """✅ Playwright Pipeline: All Tests Passed
Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

DEV:   ${env.DEV_TEST_STATUS}
QA:    ${env.QA_TEST_STATUS}
STAGE: ${env.STAGE_TEST_STATUS}
PROD:  ${env.PROD_TEST_STATUS}

Combined Allure: ${env.BUILD_URL}Combined_20Allure_20Report"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }

                try {
                    emailext(
                        subject: "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """Playwright pipeline SUCCESS.

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

DEV:   ${env.DEV_TEST_STATUS}
QA:    ${env.QA_TEST_STATUS}
STAGE: ${env.STAGE_TEST_STATUS}
PROD:  ${env.PROD_TEST_STATUS}

Combined Allure Report:
${env.BUILD_URL}Combined_20Allure_20Report
""",
                        mimeType: 'text/plain',
                        to: env.EMAIL_RECIPIENTS,
                        from: 'CI Notifications <mail@adithautomation.com>',
                        replyTo: 'mail@adithautomation.com'
                    )
                } catch (Exception e) {
                    echo "Email notification failed: ${e.message}"
                }
            }
        }

        failure {
            echo '❌ Pipeline failed!'

            script {
                try {
                    slackSend(
                        color: 'danger',
                        message: """❌ Playwright Pipeline: Tests Failed
Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

DEV:   ${env.DEV_TEST_STATUS ?: 'not run'}
QA:    ${env.QA_TEST_STATUS ?: 'not run'}
STAGE: ${env.STAGE_TEST_STATUS ?: 'not run'}
PROD:  ${env.PROD_TEST_STATUS ?: 'not run'}

Build URL: ${env.BUILD_URL}"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }

                try {
                    emailext(
                        subject: "❌ Playwright Tests Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        body: """Playwright pipeline FAILED.

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

DEV:   ${env.DEV_TEST_STATUS ?: 'not run'}
QA:    ${env.QA_TEST_STATUS ?: 'not run'}
STAGE: ${env.STAGE_TEST_STATUS ?: 'not run'}
PROD:  ${env.PROD_TEST_STATUS ?: 'not run'}

Build URL:
${env.BUILD_URL}
Console:
${env.BUILD_URL}console
""",
                        mimeType: 'text/plain',
                        to: env.EMAIL_RECIPIENTS,
                        from: 'CI Notifications <mail@adithautomation.com>',
                        replyTo: 'mail@adithautomation.com'
                    )
                } catch (Exception e) {
                    echo "Email notification failed: ${e.message}"
                }
            }
        }

        unstable {
            echo '⚠️ Pipeline completed with warnings!'
            script {
                try {
                    slackSend(
                        color: 'warning',
                        message: """⚠️ Playwright Pipeline: Unstable
Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

Build URL: ${env.BUILD_URL}"""
                    )
                } catch (Exception e) {
                    echo "Slack notification failed: ${e.message}"
                }
            }
        }
    }
}
