// A simple test to verify a visible window is opened with a title
const Application = require('spectron').Application
const assert = require('assert')
const os = require('os')
let appPath = ''

if(os.platform === 'darwin') {
    // appPath = '/Applications/MyApp.app/Contents/MacOS/MyApp'
} else {
    appPath = './dist/win-unpacked/fabnavi.exe'
}

const app = new Application({
    path: appPath
})

app.start().then(function () {
    // Check if the window is visible
    return app.browserWindow.isVisible()
}).then(function (isVisible) {
    // Verify the window is visible
    assert.equal(isVisible, true)
}).then(function () {
    // Get the window's title
    return app.client.getTitle()
}).then(function (title) {
    // Verify the window's title
    assert.equal(title, 'fabnavi')
}).then(function () {
    // Stop the application
    return app.stop()
}).catch(function (error) {
    // Log any failures
    console.error('Test failed', error.message)
})