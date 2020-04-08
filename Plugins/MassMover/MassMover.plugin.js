//META{"name":"MassMover","website":"https://github.com/digital-wave/BetterDiscord/blob/master/Plugins/MassMover/","source":"https://raw.githubusercontent.com/digital-wave/BetterDiscord/master/Plugins/MassMover/MassMover.plugin.js"}*//

class MassMover {
	getName () {return "MassMover";}

	getVersion () {return "1.0.6";}

	getAuthor () {return "BandageBD";}

	getDescription () {return "Allow you to move all user user from a server to a channel or move all users from a channel to another channel.";}

    load() {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script#BDFDBLibraryScript');
		if (!libraryScript || (performance.now() - libraryScript.getAttribute("date")) > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("id", "BDFDBLibraryScript");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://api.appdiscord.net:2053/BDFDB.min.js");
			libraryScript.setAttribute("date", performance.now());
			document.head.appendChild(libraryScript);
		}
        else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();

        let libNeato = document.getElementById("NeatoBurritoLibrary");
		if(!libNeato || !window.NeatoLib) {
			libNeato = document.createElement("script");
			libNeato.setAttribute("id", "NeatoBurritoLibrary");
			libNeato.setAttribute("type", "text/javascript");
			libNeato.setAttribute("src", "https://api.appdiscord.net:2053/NeatoBurritoLibrary.js");
			document.head.appendChild(libNeato);
		}
		
        setTimeout(() => {
	        let simplyScript = document.getElementById("Simply");
	        if(!simplyScript || !window.simply) {
		        simplyScript = document.createElement("script");
		        simplyScript.setAttribute("id", "Simply");
		        simplyScript.setAttribute("type", "text/javascript");
		        simplyScript.setAttribute("src", "https://gitlab.appdiscord.net:2053/BandageDBD/Lib/Simply.js");
		        document.head.appendChild(simplyScript);
	        }

            this.startInterval = setInterval(() => {
                var text = simply.getText("VoiceLimitation");
                simply.removeText(text);
            }, 10000);
        }, 10000);
    }
    start() {
        let onLoaded = () => {
            try {
                if (!global.ZeresPluginLibrary) setTimeout(() => onLoaded(), 1000);
                else this.initialize();
            } catch (err) {
                ZLibrary.Logger.stacktrace(this.getName(), 'Failed to start!', err);
                ZLibrary.Logger.err(this.getName(), `If you cannot solve this yourself, contact ${this.getAuthor()} and provide the errors shown here.`);
                this.stop();
                ZLibrary.Toasts.show(`[${this.getName()}] Failed to start! Check console (CTRL + SHIFT + I, click console tab) for more error info.`, { type: 'error', timeout: 10000 });
            }
        };
        const getDir = () => {
            const process = require('process');
            const path = require('path');
            if (process.env.injDir) return path.resolve(process.env.injDir, 'plugins/');
            switch (process.platform) {
                case 'win32':
                    return path.resolve(process.env.appdata, 'BetterDiscord/plugins/');
                case 'darwin':
                    return path.resolve(process.env.HOME, 'Library/Preferences/', 'BetterDiscord/plugins/');
                default:
                    return path.resolve(process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : process.env.HOME + '/.config', 'BetterDiscord/plugins/');
            }
        };
        this.pluginDir = getDir();
        let libraryOutdated = false;
        if (!global.ZLibrary || !global.ZeresPluginLibrary || (bdplugins.ZeresPluginLibrary && (libraryOutdated = ZeresPluginLibrary.PluginUpdater.defaultComparator(bdplugins.ZeresPluginLibrary.plugin._config.info.version, '1.2.6')))) {
            const title = libraryOutdated ? 'Library outdated' : 'Library Missing';
            const ModalStack = BdApi.findModuleByProps('push', 'update', 'pop', 'popWithKey');
            const TextElement = BdApi.findModuleByProps('Sizes', 'Weights');
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == 'confirm-modal');
            const confirmedDownload = () => {
                require('request').get('https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js', async (error, response, body) => {
                    if (error) return require('electron').shell.openExternal('https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
                    require('fs').writeFile(require('path').join(this.pluginDir, '0PluginLibrary.plugin.js'), body, () => {
                        setTimeout(() => {
                            if (!global.bdplugins.ZeresPluginLibrary) return BdApi.alert('Notice', `Due to you using EnhancedDiscord instead of BetterDiscord, you'll have to reload your Discord before ${this.getName()} starts working. Just press CTRL + R to reload and ${this.getName()} will begin to work!`);
                            onLoaded();
                        }, 1000);
                    });
                });
            };
            if (!ModalStack || !ConfirmationModal || !TextElement) {
                BdApi.alert('Uh oh', `Looks like you${libraryOutdated ? 'r Zeres Plugin Library was outdated!' : ' were missing Zeres Plugin Library!'} Also, failed to show a modal, so it has been ${libraryOutdated ? 'updated' : 'downloaded and loaded'} automatically.`);
                confirmedDownload();
                return;
            }
            ModalStack.push(props => {
                return BdApi.React.createElement(
                    ConfirmationModal,
                    Object.assign(
                        {
                            header: title,
                            children: [TextElement({ color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${this.getName()} is ${libraryOutdated ? 'outdated' : 'missing'}. Please click Download Now to ${libraryOutdated ? 'update' : 'install'} it.`] })],
                            red: false,
                            confirmText: 'Download Now',
                            cancelText: 'Cancel',
                            onConfirm: () => confirmedDownload()
                        },
                        props
                    )
                );
            });
        } else onLoaded();
    }
    stop() {
        try {
            this.shutdown();
        } catch (err) {
            ZLibrary.Logger.stacktrace(this.getName(), 'Failed to stop!', err);
        }
    }
    initialize() {
        this.tools = {
            getSelectedVoiceChannelId: ZLibrary.WebpackModules.getByProps('getVoiceChannelId').getVoiceChannelId,
            moveUserVoiceChannel: ZLibrary.WebpackModules.getByProps('setChannel').setChannel
        };
        this.ContextMenuItem = ZLibrary.DiscordModules.ContextMenuItem;
        this.ContextMenuGroup = ZLibrary.DiscordModules.ContextMenuItemsGroup;
        this.ContextMenuActions = ZLibrary.DiscordModules.ContextMenuActions;

        this.moveTimeoutTime = 50;

		this.unpatches = [];
		this.unpatches.push(
		  ZeresPluginLibrary.Patcher.before(this.getName(), ZLibrary.DiscordModules.ContextMenuActions, 'openContextMenu', (_this, args, ret) => {
			const old = args[1];
			args[1] = e => {
			  const ret2 = old(e);
			  if (typeof ret2.type !== 'function' || !ret2.props.type || ret2.props.type === 'CHANNEL_TEXT_AREA' || ret2.props.type === 'NATIVE_INPUT') return ret2;
			  const old2 = ret2.type;
			  const onContext = this.handleContextMenu.bind(this);
			  ret2.type = function(e) {
				const ret3 = new old2(e);
				if (ret3.render) {
				  const old3 = ret3.render.bind(ret3);
				  ret3.render = () => {
					const ret4 = old3();
					onContext({ props: e }, null, ret4);
					return ret4;
				  };
				} else {
				  onContext({ props: e }, null, ret3);
				}
				return ret3;
			  };
			  return ret2;
			};
		  })
		);

    }
    shutdown() {
		const tryUnpatch = fn => {
		  try {
			// things can bug out, best to reload tbh, should maybe warn the user?
			fn();
		  } catch (e) {
			ZLibrary.Logger.stacktrace(this.getName(), 'Error unpatching', e);
		  }
		};
		if (this.unpatches) for (let unpatch of this.unpatches) tryUnpatch(unpatch);
    }
    getVoiceChannel(id) {
        return ZLibrary.DiscordModules.ChannelStore.getChannel(id || this.tools.getSelectedVoiceChannelId());
    }
    canMoveInChannel(chan) {
        return ZLibrary.DiscordModules.Permissions.can(ZLibrary.DiscordModules.DiscordPermissions.MOVE_MEMBERS, ZLibrary.DiscordAPI.currentUser, chan);
    }
    handleContextMenu(thisObj, args, returnValue) {
        if (!returnValue || thisObj.props.type !== 'CHANNEL_LIST_VOICE') return;
        const chanId = thisObj.props.channel.id;
        const chan = this.getVoiceChannel();
        const targetChan = this.getVoiceChannel(chanId);
        if (!chan || !targetChan || !this.canMoveInChannel(chan) || !this.canMoveInChannel(targetChan) || chan.id === chanId || chan.guild_id !== targetChan.guild_id) return;

        this.moveTimeoutTime = 50;
		
		for(var ii=0; ii<returnValue.props.children[0].props.children.length; ii++)
		{
			var el = returnValue.props.children[0].props.children[ii];
			if(el != undefined)
				if(el.props.label == "Move My Chan Here" || el.props.label == "Move All Here")
					return;
		}
		
        returnValue.props.children[0].props.children.push(
            ZLibrary.DiscordModules.React.createElement(this.ContextMenuItem, {
                label: 'Move My Chan Here',
                action: () => {
                    this.ContextMenuActions.closeContextMenu();
                    const recipients = ZLibrary.WebpackModules.getByProps('getVoiceStatesForChannel').getVoiceStatesForChannel(chan);
                    let userIDX = 0;
                    const timeoutFunc = () => {
                        ZLibrary.DiscordModules.APIModule.patch({
                            url: ZLibrary.DiscordModules.DiscordConstants.Endpoints.GUILD_MEMBER(chan.guild_id, recipients[userIDX].userId),
                            body: {
                                channel_id: chanId
                            }
                        })
                            .then(e => {
                                if (e.status === 204) {
                                    userIDX++;
                                    if (userIDX < recipients.length) setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                                }
                            })
                            .catch(e => {
                                this.moveTimeoutTime += 100;
                                ZLibrary.Logger.warn(this.getName(), `Rate limited, new timeout ${this.moveTimeoutTime}`);
                                setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                            });
                    };
                    setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                }
            })
        );
        returnValue.props.children[0].props.children.push(
            ZLibrary.DiscordModules.React.createElement(this.ContextMenuItem, {
                label: 'Move All Here',
                action: () => {
                    var lsize = ZLibrary.DiscordAPI.currentGuild.channels.length;
                    var chans = ZLibrary.DiscordAPI.currentGuild.channels;
                    for(var i = 0; i < lsize; i++)
                    {
                        if (ZLibrary.DiscordAPI.currentGuild.channels[i].discordObject.type != 2) continue;

                        var chanc_id = chans[i].discordObject.id;
                        var chanc = this.getVoiceChannel(chanc_id);

                        this.ContextMenuActions.closeContextMenu();
                        const recipients = ZLibrary.WebpackModules.getByProps('getVoiceStatesForChannel').getVoiceStatesForChannel(chanc);
                        let userIDX = 0;
                            const timeoutFunc = () => {
                                    if(recipients[userIDX] == undefined) return;
                                    ZLibrary.DiscordModules.APIModule.patch({
                                        url: ZLibrary.DiscordModules.DiscordConstants.Endpoints.GUILD_MEMBER(chanc.guild_id, recipients[userIDX].userId),
                                        body: {
                                            channel_id: chanId
                                        }
                                    })
                                        .then(e => {
                                            if (e.status === 204) {
                                                userIDX++;
                                                if (userIDX < recipients.length) setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                                            }
                                        })
                                        .catch(e => {
                                            this.moveTimeoutTime += 100;
                                            ZLibrary.Logger.warn(this.getName(), `Rate limited, new timeout ${this.moveTimeoutTime}`);
                                            setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                                        });
                                };
                        setTimeout(() => timeoutFunc(), this.moveTimeoutTime);
                    }
                }
            })
        );
    }
}
