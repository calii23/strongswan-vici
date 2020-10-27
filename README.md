# Strongswan VICI
This package contains an implementation of VICI API from strongswan. This can be used to initiate connections, monitor connected devices, reconfiguration and everything else which the API offers to do.

## Installation
To use this package, just install it from NPM:
```bash
npm install -s strongswan-vici
```
Or with yarn:
```bash
yarn add strongswan-vici
```
TypeScript types **are included** in the package and don't have to be installed separately.

## `Vici` Class
To use this library, you have to create an instance of this class:
```typescript
import {Vici} from 'strongswan-vici';

const vici = new Vici();
```
This instance is now the adapter between your code and the VICI API. See documentation below.

### Constructor
The constructor accepts the following parameter. All of them are optional.

#### Socket
Default = `unix:///var/run/charon.vici`.

This parameter supports a UNIX or TCP address. Examples:
 - `unix:///var/run/charon.vici`
 - `tcp://10.0.0.1:8080`

#### Timeout
Default = `5000`

The number of milliseconds, the API has time to respond. When the timeout has exceeded, the operation with fail with an error. **This does not close the connection**

##### Idle timeout
Default = `10000`

The number of milliseconds, until the connection will be closed. When no event is subscribed and no other packets are send or received for a specified time, the connection will be closed. On next operation, the connection will be reestablished automatically.

### connect()
This method opens the connection.

**Note:** Calling this method it not necessary. The connection will be established automatically when required.

### close()
This method closes an active connection.

**Note:** This will unsubscribe all events.

### sendPacket(type, ...packet)
This will send a raw packet. Example:
```typescript
import {Vici, PacketType} from 'strongswan-vici';

const vici = new Vici();
await vici.sendPacket(PacketType.CMD_REQUEST, 'version');
```
This method will not be used in normal applications. There are simpler ways to archive a version request.

### version(), stats(), reloadSettings()
These methods are sending the corresponding command to the API. Example:
```typescript
import {Vici, PacketType} from 'strongswan-vici';

const vici = new Vici();
const version = await vici.version();
console.log('Daemon version:', version.daemon);
```

### doCommand(command, payload?)
This method performs a command. When a second parameter is give, the value will be used as parameter for the command. Example:
```typescript
import {Vici, PacketType} from 'strongswan-vici';

const vici = new Vici();
const response = await vici.doCommand('initiate', {child: 'http-server'});

if (response.success === 'yes') {
  console.log('The HTTP server has been connected');
} else {
  console.error('Failed to connect HTTP server:', response.errmsg);
}
```

### subscribe(event)
This method subscribes to an event. When the connection is reestablished, the event will be subscribed again. When the event is not known by the API, this method will throw an error.

**Note:** The connection will not reestablished automatically when lost

### subscribeMany(...event)
This method subscribes a list of events. (See [subscribe(event)](#subscribeevent))

### unsubscribe(event)
This method unsubscribes an event. This method returns a boolean, which indicates if the operation has succeeded.

### unsubscribeAll()
This method unsubscribes all currently subscribed events. This method returns a boolean, which indicates if all operations has been succeeded.

# API
For more information about the API, look in the [documentation from strongswan](https://www.strongswan.org/apidoc/md_src_libcharon_plugins_vici_README.html).

# License
**In short: I don't care, just use it.**

Copyright 2020 Maximilian Schelbach

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
