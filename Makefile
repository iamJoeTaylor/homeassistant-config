BASE_DIR="$(shell pwd)"
CALENDAR_DIR=~/Development/calendar_notification
REMOTE_HOST=pi@192.168.7.171
REMOTE_CONFIG_DIR=/config

.PHONY: test
test:
	sh $(BASE_DIR)/venv/bin/activate && hass -c . --script check_config

.PHONY: remote-test
remote-test:
	ssh $(REMOTE_HOST) 'sudo -u homeassistant /bin/bash -c "source /srv/homeassistant/homeassistant_venv/bin/activate && hass --script check_config"'

.PHONY: deploy
deploy:
	$(info Deploying HA config to $(REMOTE_HOST).)
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/*.yaml $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/automations/*.yaml $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/automations/
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/esphome/*.yaml $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/esphome/
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/ui/*.yaml $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/ui/

.PHONY: pull-remote
pull-remote:
	rsync -av --include='*yaml' --include='esphome' --include='scenes' --include='zwcfg*.xml' --exclude='*' $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/ ./
	rsync -av $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/custom_components/ ./custom_components/
	rsync -av $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/www/ ./www/
	rsync -av $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/esphome/ ./esphome/
	rsync -av $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/ui/ ./ui/

.PHONY: deploy-scripts
deploy-scripts:
	rsync -av --delete --rsync-path="sudo rsync" $(BASE_DIR)/python_scripts $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/

.PHONY: deploy-custom-components
deploy-custom-components:
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/custom_components $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/

.PHONY: deploy-www
deploy-www:
	rsync -av --rsync-path="sudo rsync" $(BASE_DIR)/www $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/
	rsync -av --rsync-path="sudo rsync" $(CALENDAR_DIR)/ $(REMOTE_HOST):$(REMOTE_CONFIG_DIR)/www/community/calendar_notification/
