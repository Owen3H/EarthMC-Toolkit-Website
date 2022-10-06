# **Quick Start**
```js
$ npm i earthmc
``` 

```js 
const emc = require("earthmc")

let towns = emc.Aurora.Towns.all().then(arr => { return arr.filter(t => t.area > 50) })

// Outputs every Aurora town with over 50 chunks claimed.
console.log(towns)
```

# **Full Guide**
## **Map Class**
The map class is the base for which methods are called from.<br>
By default, the following maps are available without requiring manual instantiation.

- Aurora
- Nova

You can import a specific map like so:
```js
const { Aurora } = require('earthmc')
``` 
or both maps if you so desire.
```js
const { Aurora, Nova } = require('earthmc')
```

### **Map Properties**
Now that we have our map(s), we can access the specific data type we want.<br>

Examples: 
```js
let [germany, mexico] = await Aurora.Nations.get(['Germany', 'Mexico'])

let invitableTowns = await Aurora.Towns.invitable('Bhutan'),
    nearbyTowns    = await Aurora.Towns.nearby(27240, 6336, 500, 800)

let townless  = await Aurora.Players.townless(),
    residents = await Aurora.Residents.all()
```

**Generic Methods**<br>
- **Get**<br>
    Format: `.get(['Query1', 'Query2'])` or `.get('Query1')`<br>
    Returns: `[{}, {}, ...]` or `{}`<br>

    > Any item that can't be found will return a custom 'NotFound' error. <br>
    See the 'Error Handling' section for further details.

- **All**<br>
    Format: `.all()`<br>
    Returns: `[{}, {}, ...]`<br>

    > To remove town accents, you can do `Towns.all(true)`

**Type Specific Methods**<br>
    
<details>
    <summary>Towns</summary>

- **Nearby**<br>
    Format: `.nearby(xInput, zInput, xRadius, zRadius, towns)`<br>
    Returns: Array of towns within the radii from the given coords.<br>

    > Parameter 'towns' is optional and defaults to null.<br>
    If specified, nearby towns will be gathered using that array.

- **Invitable**<br>
    Format: `.invitable(nationName, includeBelonging)`<br>
    Returns: Array of towns the specified nation can invite.<br>

    > Parameter 'includeBelonging' is optional and defaults to false.<br>
    If true, the resulting array will include towns that belong to a nation.
</details>

<details>
    <summary>Nations</summary>
    
- **Nearby**<br>
    Format: `.nearby(xInput, zInput, xRadius, zRadius, nations)`<br>
    Returns: Array of nations within the radii from the given coords.<br>

    > Parameter 'nations' is optional and defaults to null.<br>
    If specified, nearby nations will be gathered using that array.

- **Joinable**<br>
    Format: `.joinable(townName, nationless)`<br>
    Returns: Array of nations the specified town can join.<br>

    > Parameter 'nationless' is optional and defaults to true.<br>
    While true, the town must be nationless to be eligible for joining.
</details>

<details>
    <summary>Residents</summary>

> Only generic methods exist on this property.

</details>

<details>
    <summary>Players</summary>

- **Townless**<br>
    Format: `.townless()`<br>
    Returns: Array of online players currently without a town.<br>

- **Online**<br>
    Format: `.online(includeResidentInfo)`<br>
    Returns: Array of all online players.<br>

    > Parameter 'includeResidentInfo' is optional and defaults to false.<br>
    While true, include keys containing extra info about a resident.

- **Nearby**<br>
    Format: `.nearby(xInput, zInput, xRadius, zRadius, players)`<br>
    Returns: Array of players within the radii from the given coords.<br>

    > Parameter 'players' is optional and defaults to null.<br>
    If specified, nearby players will be gathered using that array.
</details>

<p>

## **Archive Mode**
- useArchive
- Methods that accept data, best fit for archiving.

## **Utils**
- Server info
- Endpoint
- Format string

## **Error Handling**
- Error types
- How to identify and handle errors 

# **FAQ**
- Bug reporting
- 