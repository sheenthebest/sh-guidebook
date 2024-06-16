-- variables
local settings = CFG.SETTINGS

-- code
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
RegisterNUICallback('CLOSE_UI', function()
    SetNuiFocus(false, false)
end)
