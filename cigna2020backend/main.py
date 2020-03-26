#!/usr/bin/env python
# encoding: utf-8
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from google.appengine.ext import db
from google.appengine.api import images
from google.appengine.api import urlfetch
from google.appengine.ext import ndb

         
import webapp2,jinja2,os,csv,logging,json,random

from datetime import datetime
from datetime import timedelta
import codecs
import sendgrid
from sendgrid.helpers import mail

JINJA_ENVIRONMENT = jinja2.Environment(
loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
extensions=['jinja2.ext.autoescape'],
autoescape=True)



def getCSVLineNumber():
    with open('winner.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        lastline = 0 
        for row in csv_reader:
            lastline = lastline + 1 
    return lastline 

def getCSV(line):
    with open('winner.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == line:
                print(str(line) + " " + row[0] +' won the game and winner email with qr code '+ row[1])
                return row
            else:
                line_count += 1

def testemail(content):
    # print 'test'
    # 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
    # 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
    SENDGRID_API_KEY = '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'
    SENDGRID_SENDER = 'nextmobilemarketing@nextdigital.com.hk'
    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)
    to_email = mail.Email(content[0])
    from_email = mail.Email(SENDGRID_SENDER)
    subject = '蘋果日報 X 永明金融 一Click即知你要幾錢退休'
    emailcontent_txt = """
    多謝參加《蘋果日報 X 永明金融 一Click即知你要幾錢退休》並恭喜閣下獲得HABITŪ $50電子現金券(乙張)
    閣下可憑以下電子現金券到香港HABITŪ分店，即可享$50折扣優惠。
    https://campaign.nextdigital.com.hk/sunlife2019/qrcode/"""+ content[1] + """
    HABITŪ顧客服務熱線：3550 0084
    HABITŪ分店地址：https://www.habitu.com.hk/locations
    「HABITŪ $50電子現金券」使用條款及細則：
    1.憑此電子現金券於 HABITŪ 任何分店消費可作港幣$50使用
    2.此電子現金券適用於食物，飲品及商品（不適用於支付租場活動及其所需費用）
    3.請於點菜時出示此電子現金券
    4.堂食設最低消費及需另收加一服務費
    5.此電子現金券不能兌換現金，餘額不設找贖或退款
    6.此電子現金券若違失或被盜將不設更換
    7.如有任何爭議，Next Digital Limited 及HABITŪ 保留最終決定權
    """
    emailcontent_html = """
    <html><head></head><body>
    <p>多謝參加《蘋果日報 X 永明金融 一Click即知你要幾錢退休》並恭喜閣下獲得HABITŪ $50電子現金券(乙張)</p>
    <p>閣下可憑以下電子現金券到香港HABITŪ分店，即可享$50折扣優惠。</p>
    <img style='width:100%; max-width:300px;' src='https://campaign.nextdigital.com.hk/sunlife2019/qrcode/"""+ content[1] + """'>
    <p>HABITŪ顧客服務熱線：3550 0084</p>
    <p>HABITŪ分店地址：<a href='https://www.habitu.com.hk/locations' target='_blank'>https://www.habitu.com.hk/locations</a></p>
    <p><b>「HABITŪ $50電子現金券」使用條款及細則：</b></p>
    <p>1.憑此電子現金券於 HABITŪ 任何分店消費可作港幣$50使用</p>
    <p>2.此電子現金券適用於食物，飲品及商品（不適用於支付租場活動及其所需費用）</p>
    <p>3.請於點菜時出示此電子現金券</p>
    <p>4.堂食設最低消費及需另收加一服務費</p>
    <p>5.此電子現金券不能兌換現金，餘額不設找贖或退款</p>
    <p>6.此電子現金券若違失或被盜將不設更換</p>
    <p>7.如有任何爭議，Next Digital Limited 及HABITŪ 保留最終決定權</p>
    </body></html>
    """
    content_text = mail.Content('text/plain', emailcontent_txt)
    content_html = mail.Content('text/html', emailcontent_html)
    message = mail.Mail(from_email, subject, to_email, content_html)
    message.add_content(content_text)
    response = sg.client.mail.send.post(request_body=message.get())
    print "email sent to " + content[0]
    
def getbyphone(phone):
    user = Users.query().filter(Users.MOBILE==phone).count()
    return user

class Users(ndb.Model):
    DATE_ADDED = ndb.DateTimeProperty(auto_now_add=True)
    DATE_MODIFIED = ndb.DateTimeProperty(auto_now=True)
    PLAYTIME = ndb.DateTimeProperty()
    FIRSTNAME = ndb.StringProperty(default='')
    LASTNAME = ndb.StringProperty(default='')
    SEX = ndb.StringProperty(default='')
    MOBILE = ndb.StringProperty(default='')
    EMAIL = ndb.StringProperty(default='')
    Q1 = ndb.StringProperty(default='')
    Q2 = ndb.StringProperty(default='')
    PROMOTION = ndb.StringProperty(default='')
    TNC = ndb.StringProperty(default='')
        
class MainFormHandler(webapp2.RequestHandler):
    def get(self):
        phone = self.request.get('phone')
        user = getbyphone(phone)
        self.response.write(user)     
       

class SubmitHandler(webapp2.RequestHandler):
    def post(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        return_data = {}
        plastname = self.request.get('lastname')
        pfirstname = self.request.get('firstname')
        psex = self.request.get('sex')
        pmobile = self.request.get('mobile')
        pemail = self.request.get('email')
        q1 = self.request.get('q1')
        q2 = self.request.get('q2')
        ppromotion = self.request.get('promotion')
        ptnc = self.request.get('tnc')
        ptime = datetime.now() + timedelta(hours=8)
        print pmobile,pemail #,pname.decode('utf-8'),pname.encode("utf8")
        return_data = {}
        try:
            if getbyphone(pmobile) == 0 :
                users = Users(LASTNAME=plastname,FIRSTNAME=pfirstname,SEX=psex,MOBILE=pmobile,EMAIL=pemail,Q1=q1,Q2=q2,PROMOTION=ppromotion,TNC=ptnc,PLAYTIME=ptime).put()
                #user=users.get_current_user().user_id(),
                print "SUCCESS"
                return_data['status'] = "Success"
            else :
                print "DUPLICATED"
                return_data['status'] = "Duplicated"    
        except:
            print "FAIL"
            #self.error(500)
            return_data['status'] = "Fail"
        self.response.out.write(json.dumps(return_data))
                

class ShowResultHandler(webapp2.RequestHandler): 
    def get(self):
        ppassword = self.request.get('password')
        if ppassword == "1234" :
            print users.count()
            if(users.count() > 0) :
                users = users.order(Users.PLAYTIME)
                print users.fetch(1)
            #users.order(UserPhoto.PLAYTIME)
            template_values = {
            	'users': users,
            }
            template = JINJA_ENVIRONMENT.get_template('admin.html')
            self.response.write(template.render(template_values))  
        else:
            template = JINJA_ENVIRONMENT.get_template('login.html')
            self.response.write(template.render()) 
    def post(self):
        ppassword = self.request.get('password')
        if ppassword == "1234" :
            users = Users.query() #.filter(UserPhoto.GROUP != "hello")
            print users.count()
            if(users.count() > 0) :
                users = users.order(+Users.PLAYTIME)
                # usersPLAYTIME = users.PLAYTIME + timedelta(hours=8) 
                print users
            #users.order(UserPhoto.PLAYTIME)
            template_values = {
            	'users': users,
            }
            template = JINJA_ENVIRONMENT.get_template('admin.html')
            self.response.write(template.render(template_values))  
        else:
            template = JINJA_ENVIRONMENT.get_template('login.html')
            self.response.write(template.render())               


class GetGoogleSpreadsheetHandler(webapp2.RequestHandler): 
    def get(self):
        scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_name('sunlife2019backend-418dfd84e48e.json', scope)
        gc = gspread.authorize(credentials)
        wks = gc.open("Where is the money Lebowski?").sheet1
        self.response.write(wks)   

class csvReadHandler(webapp2.RequestHandler):
    def get(self):
        self.readcsv()
    def post(self):
        self.readcsv()
    def readcsv(self): 
        emilcount = getCSVLineNumber()
        print "emilcount=" + str(emilcount)
        for x in range(emilcount):
            emaildata = getCSV(x)
            print(emaildata)
            testemail(emaildata)
        self.response.write('done!')

app = webapp2.WSGIApplication([
    ('/', MainFormHandler),
    ('/showresult', ShowResultHandler),
    ('/submit', SubmitHandler),
    ('/csvRead', csvReadHandler),
    ('/getspreadsheet', GetGoogleSpreadsheetHandler)
], debug=True)