// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("updates:lobby", {})

var newPost = location.pathname.startsWith("/broadcasts")
var posted = location.hash == "#newPost"
// let messageContainer = $("#broadcast-show")
// let broadcastContainer = $("#broadcast-index-container")
//
// let msgId
// let msgDesc
// let msgUser

let bField = $("#broadcast-field")
let bContainer = $("#broadcast-index")
let bInput = $("#broadcast_desc")

let pp = $($("#broadcast-user")[0]);
let pu_id = pp.data('current_id');
console.log("pu id" + pu_id);
console.log("binput !" + bInput.val());


// using JS
function resetHash() {
	window.location.hash = "";
}
console.log("post has user?" + window.post_user)

function inputKeyUp() {
	console.log("New post!!!!");
	if(newPost && posted) {
		// msgId = post_id
		msgDesc = post_desc
		// msgUser = post_user
		channel.push("new_msg", {desc: msgDesc, user_id: pu_id});
		resetHash();
	}
}

channel.on("new_msg", payload => {
	console.log("AM I POSTING ON INDEX REALTIME?");
	let messageItem = `<p>${payload.desc}</p>`
	bContainer.prepend($(messageItem))
})

inputKeyUp()

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
