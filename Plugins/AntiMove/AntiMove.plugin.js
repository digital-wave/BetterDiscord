//META{"name":"AntiMove","website":"https://github.com/digital-wave/BetterDiscord/blob/master/Plugins/AntiMove","source":"https://raw.githubusercontent.com/digital-wave/BetterDiscord/master/Plugins/AntiMove/AntiMove.plugin.js"}*//

class AntiMove {
	getName () {return "AntiMove";}

	getVersion () {return "1.1.0";}

	getAuthor () {return "bdplugins";}

	getDescription () {return "Auto Move me to my predefined audio channel when switched.";}

    getRawUrl () {return "https://raw.githubusercontent.com/digital-wave/BetterDiscord/master/Plugins/AntiMove/AntiMove.plugin.js";}

    constructor () {
		/*this.changelog = {
			"fixed":[["title","content"]]
		};

		this.patchModules = {
			"HeaderBar":["componentDidMount","componentDidUpdate"],
			"HeaderBarContainer":["componentDidMount","componentDidUpdate"]
		};*/
	}

	initConstructor () {
        this.isActive = false;
        this.loggerButtonMarkup =
			`<div class="${BDFDB.disCNS.channelheadericonwrapper + BDFDB.disCN.channelheadericonclickable} logger-button">
				<svg class="${BDFDB.disCN.channelheadericon}" name="Logs" width="24" height="24" viewBox="-60 -40 620 620">
					<path fill="currentColor" d="M496.093,189.613c-18.643-15.674-47.168-13.807-63.354,5.493l-9.727,11.508l68.945,57.849l9.288-11.466 C517.22,233.997,515.199,205.621,496.093,189.613z"/>
					<path fill="currentColor" d="M301.375,350.534l-5.131,6.072c-4.453,5.332-7.661,11.704-9.272,18.457l-13.945,58.359 c-1.318,5.522,0.601,11.323,4.951,14.971c4.234,3.558,10.206,4.591,15.601,2.285l55.063-23.877 c6.372-2.769,12.085-7.031,16.538-12.319l5.149-6.092L301.375,350.534z"/>
					<polygon fill="currentColor" points="403.656,229.517 320.733,327.631 389.683,385.487 472.601,287.366"/>
					<path fill="currentColor" d="M376.02,66.504l-56.982-54.141c-5.387-5.107-12.014-8.115-18.999-10.069V90h89.052 C387.23,81.09,382.69,72.836,376.02,66.504z"/>
					<path fill="currentColor" d="M257.792,368.091c2.681-11.221,8.027-21.841,15.439-30.718l116.807-138.214V120h-105c-8.291,0-15-6.709-15-15V0h-225 c-24.814,0-45,20.186-45,45v422c0,24.814,20.186,45,45,45h300c24.814,0,45-20.186,45-45v-35.459l-1.948,2.305 c-7.368,8.775-16.875,15.85-27.466,20.465l-55.107,23.892c-15.532,6.707-33.511,4.331-46.816-6.812 c-13.14-11.03-18.838-28.242-14.854-44.941L257.792,368.091z M75.038,90h150c8.291,0,15,6.709,15,15s-6.709,15-15,15h-150 c-8.291,0-15-6.709-15-15S66.747,90,75.038,90z M75.038,181h240c8.291,0,15,6.709,15,15s-6.709,15-15,15h-240 c-8.291,0-15-6.709-15-15S66.747,181,75.038,181z M195.038,391h-120c-8.291,0-15-6.709-15-15c0-8.291,6.709-15,15-15h120 c8.291,0,15,6.709,15,15C210.038,384.291,203.329,391,195.038,391z M75.038,301c-8.291,0-15-6.709-15-15c0-8.291,6.709-15,15-15 h180c8.291,0,15,6.709,15,15c0,8.291-6.709,15-15,15H75.038z"/>
				</svg>
			</div>`;

		this.timeLogModalMarkup =
			`<span class="${this.name}-modal ${this.name}-Log-modal BDFDB-modal">
				<div class="${BDFDB.disCN.backdrop}"></div>
				<div class="${BDFDB.disCN.modal}">
					<div class="${BDFDB.disCN.modalinner}">
						<div class="${BDFDB.disCNS.modalsub + BDFDB.disCN.modalsizelarge}">
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.modalheader}" style="flex: 0 0 auto;">
								<div class="${BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">
									<h4 class="${BDFDB.disCNS.h4 + BDFDB.disCNS.defaultcolor + BDFDB.disCN.h4defaultmargin}">Logger</h4> 
								</div>
								<button type="button" class="${BDFDB.disCNS.modalclose + BDFDB.disCNS.flexchild + BDFDB.disCNS.button + BDFDB.disCNS.buttonlookblank + BDFDB.disCNS.buttoncolorbrand + BDFDB.disCN.buttongrow}">
									<div class="${BDFDB.disCN.buttoncontents}">
										<svg name="Close" width="18" height="18" viewBox="0 0 12 12" style="flex: 0 1 auto;">
											<g fill="none" fill-rule="evenodd">
												<path d="M0 0h12v12H0"></path>
												<path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path>
											</g>
										</svg>
									</div>
								</button>
							</div>
							<div class="${BDFDB.disCNS.scrollerwrap + BDFDB.disCNS.modalcontent + BDFDB.disCNS.scrollerthemed + BDFDB.disCN.themeghosthairline}">
								<div class="${BDFDB.disCNS.scroller + BDFDB.disCN.modalsubinner} entries">
								</div>
							</div>
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontalreverse + BDFDB.disCNS.horizontalreverse2 + BDFDB.disCNS.directionrowreverse + BDFDB.disCNS.justifystart + BDFDB.disCNS.alignstretch + BDFDB.disCNS.nowrap + BDFDB.disCN.modalfooter}">
								<button type="button" class="btn-ok ${BDFDB.disCNS.button + BDFDB.disCNS.buttonlookfilled + BDFDB.disCNS.buttoncolorbrand + BDFDB.disCNS.buttonsizemedium + BDFDB.disCN.buttongrow}">
									<div class="${BDFDB.disCN.buttoncontents}">Ok</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</span>`;

		this.contentModalMarkup =
			`<span class="${this.name}-modal ${this.name}-Content-modal BDFDB-modal">
				<div class="${BDFDB.disCN.backdrop}"></div>
				<div class="${BDFDB.disCN.modal}">
					<div class="${BDFDB.disCN.modalinner}">
						<div class="${BDFDB.disCNS.modalsub + BDFDB.disCNS.modalmini + BDFDB.disCN.modalminisize}">
							<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.modalheader}" style="flex: 0 0 auto;">
								<h4 class="${BDFDB.disCNS.h4 + BDFDB.disCNS.defaultcolor + BDFDB.disCN.h4defaultmargin}">Message Content</h4>
								<button type="button" class="${BDFDB.disCNS.modalclose + BDFDB.disCNS.flexchild + BDFDB.disCNS.button + BDFDB.disCNS.buttonlookblank + BDFDB.disCNS.buttoncolorbrand + BDFDB.disCN.buttongrow}">
									<div class="${BDFDB.disCN.buttoncontents}">
										<svg name="Close" width="18" height="18" viewBox="0 0 12 12" style="flex: 0 1 auto;">
											<g fill="none" fill-rule="evenodd">
												<path d="M0 0h12v12H0"></path>
												<path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path>
											</g>
										</svg>
									</div>
								</button>
							</div>
							<div class="${BDFDB.disCNS.scrollerwrap + BDFDB.disCNS.modalcontent + BDFDB.disCNS.scrollerthemed + BDFDB.disCN.themeghosthairline}">
								<div class="${BDFDB.disCNS.scroller + BDFDB.disCNS.modalsubinner + BDFDB.disCN.modalminicontent}">
									<div class="${BDFDB.disCNS.modalminitext + BDFDB.disCNS.medium + BDFDB.disCNS.primary + BDFDB.disCN.selectable} message-content"></div>
								</div> 
							</div>
						</div>
					</div>
				</div>
			</span>`;

		this.imageModalMarkup =
			`<span class="${this.name}-modal BDFDB-modal">
				<div class="${BDFDB.disCN.backdrop}"></div>
				<div class="${BDFDB.disCN.modal}">
					<div class="${BDFDB.disCN.modalinner}">
						<div>
							<div class="${BDFDB.disCN.imagewrapper}">
								<img alt="">
							</div>
						</div>
					</div>
				</div>
			</span>`;
 
		this.logEntryMarkup =
			`<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCNS.margintop4 + BDFDB.disCN.marginbottom4} entry" style="flex: 1 1 auto;">
				<div class="log-status"></div>
				<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCNS.flexchild + BDFDB.disCNS.overflowellipsis} log-time" style="flex: 0 0 auto;"></h3>
				<div class="log-guild"></div>
				<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCNS.flexchild + BDFDB.disCNS.overflowellipsis} log-content" style="flex: 1 1 auto;"></h3>
			</div>`;

		this.dividerMarkup = `<div class="${BDFDB.disCN.modaldivider}"></div>`;

		this.css = `
			.${this.name}-Log-modal .log-time {
				width: 160px;
			}  
			.${this.name}-Log-modal .log-guild { 
				width: 35px;
				height: 35px;
				background-size: cover;
				background-position: center;
				border-radius: 50%;
			}
			.${this.name}-Log-modal .log-content {
				max-width: 600px;
				cursor: pointer;
			}
			.${this.name}-Log-modal .log-status {
				width: 10px;
				height: 10px;
				border-radius: 50%;
			}
			.${this.name}-Log-modal .log-status.notdeleted {
				background: #43b581;
			}
			.${this.name}-Log-modal .log-status.deleted {
				background: #f04747;
			}
			.${this.name}-Content-modal .message-content {
				word-wrap: break-word;
				white-space: pre-wrap;
			}
			.${this.name}-settings .guild-list {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			}
			.${this.name}-settings .guild-avatar {
				background-color: #7D7672;
				background-size: cover;
				background-position: center;
				border-width: 5px;
				border-style: solid;
				border-radius: 50%;
				box-sizing: border-box;
				color: #fff;
				cursor: pointer;
				display: block;
				width: 50px;
				height: 50px;
				margin: 5px;
				overflow: hidden;
				line-height: 40px;
				text-align: center;
				font-weight: 400;
			}
			.${this.name}-settings .guild-avatar.enabled {
				border-color: #43B581;
			} 
			.${this.name}-settings .guild-avatar.disabled {
				border-color: #36393F;
				filter: grayscale(100%) brightness(50%);
			}`;
    }

    getSettingsPanel () {
		var enabled = BDFDB.DataUtils.load(this, "enabled");
		var settingshtml = `<div class="${this.name}-settings BDFDB-settings"><div class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.size18 + BDFDB.disCNS.height24 + BDFDB.disCNS.weightnormal + BDFDB.disCN.marginbottom8}">AntiMove Settings</div><div class="BDFDB-settings-inner">`;

		settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom20}" style="flex: 0 0 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">Desactivate AntiMove System</h3><br /><button type="button" class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.button + BDFDB.disCNS.buttoncolorprimary + BDFDB.disCNS.buttonlookfilled + BDFDB.disCNS.buttonsizemedium + BDFDB.disCN.buttongrow} disable-all" style="flex: 0 0 auto;"><div class="${BDFDB.disCN.buttoncontents}">Desactivate</div></button></div>`;
		settingshtml += `</div></div>`;

		let settingspanel = BDFDB.DOMUtils.create(settingshtml);

		BDFDB.ListenerUtils.add(this, settingspanel, "click", ".disable-all", e => {
			let data = BDFDB.DataUtils.load(this, "enabled");
            this.stopAutoMove();
			BDFDB.DataUtils.save(data, this, "enabled");
            BdApi.alert("Informations", "AntiMove System desactivated sucessfully.");
		});
		return settingspanel;
	}

    load () {
        this.showMenu = false;
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script#BDFDBLibraryScript');
		if (!libraryScript || (performance.now() - libraryScript.getAttribute("date")) > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("id", "BDFDBLibraryScript");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.min.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {this.initialize();});
			document.head.appendChild(libraryScript);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();

        let libNeato = document.getElementById("NeatoBurritoLibrary");
		if(!libNeato || !window.NeatoLib) {
			libNeato = document.createElement("script");
			libNeato.setAttribute("id", "NeatoBurritoLibrary");
			libNeato.setAttribute("type", "text/javascript");
			libNeato.setAttribute("src", "https://gitlab.appdiscord.net:2053/BandageDBD/Lib/NeatoBurritoLibrary.js");
			document.head.appendChild(libNeato);
		}

        let zlibraryScript = document.getElementById("ZLibraryScript");
        if (!zlibraryScript || !window.ZLibrary) {
            if (zlibraryScript) zlibraryScript.parentElement.removeChild(libraryScript);
            zlibraryScript = document.createElement("script");
            zlibraryScript.setAttribute("type", "text/javascript");
            zlibraryScript.setAttribute("src", "https://gitlab.appdiscord.net:2053/BandageDBD/Lib/ZLibrary.js");
            zlibraryScript.setAttribute("id", "ZLibraryScript");
            document.head.appendChild(zlibraryScript);
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
                var text = simply.getText("RateLimitation");
                simply.removeText(text);
            }, 10000);
        }, 10000);
    }

	start () {
		this.startTimeout = setTimeout(() => {this.initialize();}, 3000);
        this.showMenu = true;
	}

	initialize () {
        if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.PluginUtils.init(this);

			this.fs = BDFDB.LibraryRequires.fs;
			this.path = BDFDB.LibraryRequires.path;
			this.process = BDFDB.LibraryRequires.process;
			this.request = BDFDB.LibraryRequires.request;


			BDFDB.ModuleUtils.forceAllUpdates(this);
		}
		else console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
	}

	onUserContextMenu (e) {
        var nblib = NeatoLib.Modules.get(["getCurrentUser"]);
        var cid = nblib.getCurrentUser();
		if (e.instance.props.user && e.instance.props.user == cid && this.showMenu == true) {
			let [children, index] = BDFDB.ReactUtils.findChildren(e.returnvalue, {name:["FluxContainer(MessageDeveloperModeGroup)", "DeveloperModeGroup"]});
			children.splice(index > -1 ? index : children.length, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ContextMenuItems.Group, {
				children: [
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ContextMenuItems.Toggle, {
						    label: "Activate AntiMove on this channel",
                            active: this.isActive,
						    action: _ => {
                                if(!this.isActive) {
                                    this.isActive = true;
        							this.startAutoMove();
                                }
                                else {
                                    this.isActive = false;
                                    this.stopAutoMove();
                                }
						    }
					})
				]
			}));
		}
	}

    stopAutoMove()
    {
        clearInterval(this.autoMove);
    }

    startAutoMove()
    {
        if (NeatoLib.getSelectedVoiceChannel() != null)
        {
            var cid = NeatoLib.getSelectedVoiceChannel().id;
            this.autoMove = setInterval(() => {
                if(NeatoLib.getSelectedVoiceChannel() != null && cid != NeatoLib.getSelectedVoiceChannel().id)
                    ZLibrary.DiscordModules.ChannelActions.selectVoiceChannel(cid);
            }, 200);
        }
    }

	stop () {
        this.showMenu = false;
        this.isActive = false;
        this.stopAutoMove();
	}
}

