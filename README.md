# notify-atcoder-submittion-to-slack-var-1
google apps script を使用

5分おきに実行することで、登録ユーザーが Atcoder にコードを提出すると slack に通知が来る

slack のチャンネルでメンションを付けて呼ぶことで、コマンドを打つことができる。


コマンド一覧
- add_user (ユーザー名) ... : ユーザー名を登録
- erase_user (ユーザー名) ... : ユーザー名を登録解除
- users: 登録しているユーザー名を表示
