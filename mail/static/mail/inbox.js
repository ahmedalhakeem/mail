document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox', inbox);
  document.querySelector('#compose-form').onsubmit = load_mailbox('sent');

  
});



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block'

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  //when submit button clicked
  document.querySelector('#compose-form').onsubmit = function(){
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients : document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
   
    .then(response => response.json())
    .then(result => {
      
      console.log(result);
      
      
      
    });
    load_mailbox('sent');
    
    
  };
};
  
  
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details').innerHTML = "";
  document.querySelector('#email-details').style.display = 'none';
  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Create div container and div for each email.
    const container = document.createElement('div');
    container.id ='emails-container';
    document.querySelector('#emails-view').append(container);
    for(let i=0; i < emails.length; i++){
      console.log(emails[i]);
      const email = document.createElement('div');
      email.className = 'email';
      email.id = emails[i].id;
      const sender = document.createElement('h3');
      const subject = document.createElement('p');
      sender.innerHTML = emails[i].sender ;
      subject.innerHTML = emails[i].subject;
      email.append(subject);
      email.append(sender);
      const button = document.createElement('button');
      button.id = 'archive';
      button.style.float = 'right';
      email.append(button);
      //Cehck whether the email has been archived or not!.
      if (emails[i].archived === false){
          button.innerHTML = 'Archive';
          button.onclick = function(){
            fetch(`emails/${emails[i].id}`,{
              method: 'PUT',
              body: JSON.stringify({
                archived: true
              })
            })
            email.style.display='none';
          }
          
      }
      else{
        button.innerHTML = 'Unarchive';
        button.onclick = function(){
          fetch(`emails/${emails[i].id}`,{
            method: 'PUT',
            body: JSON.stringify({
              archived: false
            })
          })
          email.style.display='none';
        }
      }
      
      
    //End of Archiving function 
      if(emails[i].read === true){
        email.style.background = 'gray';
      }
      
      container.append(email)
    
    }        
  })
 
  .catch(err=>console.log(err))
  
};
// End of Load_mailbox()
//******View Mail*********/
document.addEventListener('click', event => {
  const element = event.target;
  if(element.className === 'email'){
    document.querySelector('#emails-view').style.display = 'none';

    fetch(`emails/${element.id}`)
    .then(response => response.json())
    .then(email => {
      
      const emdet = document.createElement('div');
      emdet.className = 'email-detail';
      emdet.style.display = 'block';
      // Create a paragraph tag for each field:
      const sender = document.createElement('p');
      const recipent = document.createElement('p');
      const sub = document.createElement('p');
      const body = document.createElement('p');
      const reply = document.createElement('button');
      reply.innerHTML = 'Reply';   
      sender.innerHTML = `<b>From</b>: ${email['sender']}`;
      recipent.innerHTML = `<b>To</b>: ${email['recipients']}`;
      sub.innerHTML = `<b>subject</b>: ${email['subject']}`;
      body.innerHTML = `<b>body</b>: ${email['body']}`;


      emdet.append(sender, recipent, sub, body, reply);
      document.querySelector('#email-details').appendChild(emdet);     
      document.querySelector('#email-details').style.display = 'block';
  
      //*******Reply button*********//
      reply.onclick = function(){
        document.querySelector('#email-details').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
        document.querySelector('#compose-recipients').value = email['sender'];
        document.querySelector('#compose-subject').value = email['subject'];
        const subj = document.querySelector('#compose-subject').value;
        console.log(subj);
        if(subj.startsWith("Re:")){
          document.querySelector('#compose-subject').value =  email['subject']
        }
        else{
          document.querySelector('#compose-subject').value = 'Re:' +  email['subject'];          
        }
        document.querySelector('#compose-body').value = 'On ' + email['timestamp'] + ', ' + email['sender'] + ', ' + 'wrote: ' + email['body'];
        

      } 
      document.querySelector('#compose-form').onsubmit = function(){
        fetch('/emails', {
          method: 'POST',
          body: JSON.stringify({
            recipients: document.querySelector('#compose-recipients').value,
            subject: document.querySelector('#compose-subject').value,
            body: document.querySelector('#compose-body').value
          })
        })
        .then(response => response.json())
        .then(result => {
          console.log(result)
        })
      }  
      
                
    })
  };
    fetch(`emails/${element.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })

    })
});


