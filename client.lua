-- variables
local settings = {
    -- UI settings are located at html/config.js folder
    -- list of control keys https://docs.fivem.net/docs/game-references/input-mapper-parameter-ids/keyboard/

    command = 'guidebook', -- name of command
    keybind = 'F1', -- control key or false to disable it
}

-- command and keybind
if settings.command then
    RegisterCommand(settings.command, function()
        SetNuiFocus(true, true)
        SendNUIMessage({ action = 'SHOW_UI' })
    end)

    if settings.keybind then
        RegisterKeyMapping(settings.command, 'Guidebook', 'keyboard', settings.keybind)
    end
end

-- NUI Callbacks --
RegisterNUICallback('CLOSE_UI', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)
