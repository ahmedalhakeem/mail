document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox', inbox);
});



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

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
  };
};
  
  
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

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
      
      container.append(email)
    
    }        
  })
 
  .catch(err=>console.log(err))
  
};

document.addEventListener('click', event => {
  const element = event.target;
  if(element.className === 'email'){
    
    fetch(`emails/${element.id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email);
      const emdet = document.createElement('div');
      emdet.className = 'email-detail';
      emdet.style.display = 'block';
      // Create a paragraph tag for each field:
      const sender = document.createElement('p');
      const recipent = document.createElement('p');
      const sub = document.createElement('p');
      const body = document.createElement('p');
      sender.innerHTML = `<b>From</b>: ${email['sender']}`;
      recipent.innerHTML = `<b>To</b>: ${email['recipients']}`;
      sub.innerHTML = `<b>subject</b>: ${email['subject']}`;
      body.innerHTML = `<b>body</b>: ${email['body']}`;
      emdet.append(sender, recipent, sub, body);   
      document.querySelector('.container').append(emdet);    
      document.querySelector('#emails-view').style.display = 'none';
      

      emdet.style.display = 'block';
      //const sentby = document.createElement('p');
      console.log(email['sender']);
      console.log(`this is the ${emdet}`);
   
    })
  };
});


