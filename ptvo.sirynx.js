const zigbeeHerdsmanConverters = require('zigbee-herdsman-converters');
const zigbeeHerdsmanUtils = require('zigbee-herdsman-converters/lib/utils');


const exposes = zigbeeHerdsmanConverters['exposes'] || require("zigbee-herdsman-converters/lib/exposes");
const ea = exposes.access;
const e = exposes.presets;
const fz = zigbeeHerdsmanConverters.fromZigbeeConverters || zigbeeHerdsmanConverters.fromZigbee;
const tz = zigbeeHerdsmanConverters.toZigbeeConverters || zigbeeHerdsmanConverters.toZigbee;

const ptvo_switch = (zigbeeHerdsmanConverters.findByModel)?zigbeeHerdsmanConverters.findByModel('ptvo.switch'):zigbeeHerdsmanConverters.findByDevice({modelID: 'ptvo.switch'});
fz.legacy = ptvo_switch.meta.tuyaThermostatPreset;
fz.ptvo_on_off = {
  cluster: 'genOnOff',
  type: ['attributeReport', 'readResponse'],
  convert: (model, msg, publish, options, meta) => {
      if (msg.data.hasOwnProperty('onOff')) {
          const channel = msg.endpoint.ID;
          const endpointName = `l${channel}`;
          const binaryEndpoint = model.meta && model.meta.binaryEndpoints && model.meta.binaryEndpoints[endpointName];
          const prefix = (binaryEndpoint) ? model.meta.binaryEndpoints[endpointName] : 'state';
          const property = `${prefix}_${endpointName}`;
      if (binaryEndpoint) {
            return {[property]: msg.data['onOff'] === 1};
          }
          return {[property]: msg.data['onOff'] === 1 ? 'ON' : 'OFF'};
      }
  },
};



const device = {
    zigbeeModel: ['ptvo.sirynx'],
    model: 'ptvo.sirynx',
    vendor: 'Fox-Nest Inc',
    description: 'DIY Sirynx Zigbee Module',
    fromZigbee: [fz.ignore_basic_report, fz.ptvo_on_off,],
    toZigbee: [tz.ptvo_switch_trigger, tz.on_off,],
    exposes: [e.contact().withEndpoint('l1'),
      e.contact().withEndpoint('l2'),
	  e.switch().withEndpoint('l3'),
      e.switch().withEndpoint('l4')
],
    meta: {
        multiEndpoint: true,
        binaryEndpoints: {'l1': 'contact', 'l2': 'contact', 'l3': 'switch', 'l4': 'switch'}, 
    },
    endpoint: (device) => {
        return {
            l1: 1, l2: 2, l3: 3, l4: 4
        };
    },
	icon:	'data:image/png;base64,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',
    configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
      await endpoint.read('genBasic', ['modelId', 'swBuildId', 'powerSource']);
    },

};

module.exports = device;
