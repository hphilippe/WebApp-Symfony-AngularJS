<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Attachmentimg
 *
 * @ORM\Table(name="attachmentimg", indexes={@ORM\Index(name="fk_Attachment_attachableItem1_idx", columns={"id_post"}), @ORM\Index(name="fk_AttachmentImg_comment1_idx", columns={"id_comment"}), @ORM\Index(name="fk_AttachmentImg_chat1_idx", columns={"id_chat"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 */
class Attachmentimg
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_attachmentImg", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $idAttachmentimg;

    /**
     * @var string
     *
     * @ORM\Column(name="pathImage", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathimage;

    /**
     * @var \AppBundle\Entity\Post
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Post")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_post", referencedColumnName="id_post")
     * })
     *
     * @Serializer\Expose()
     */
    private $idPost;

    /**
     * @var \AppBundle\Entity\Comment
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Comment")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_comment", referencedColumnName="id_comment")
     * })
     *
     * @Serializer\Expose()
     */
    private $idComment;

    /**
     * @var \AppBundle\Entity\Tchat
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Tchat")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_chat", referencedColumnName="id_tchat")
     * })
     *
     * @Serializer\Expose()
     */
    private $idChat;



    /**
     * Get idAttachmentimg
     *
     * @return integer 
     */
    public function getIdAttachmentimg()
    {
        return $this->idAttachmentimg;
    }

    /**
     * Set pathimage
     *
     * @param string $pathimage
     * @return Attachmentimg
     */
    public function setPathimage($pathimage)
    {
        $this->pathimage = $pathimage;

        return $this;
    }

    /**
     * Get pathimage
     *
     * @return string 
     */
    public function getPathimage()
    {
        return $this->pathimage;
    }

    /**
     * Set idPost
     *
     * @param \AppBundle\Entity\Post $idPost
     * @return Attachmentimg
     */
    public function setIdPost(\AppBundle\Entity\Post $idPost = null)
    {
        $this->idPost = $idPost;

        return $this;
    }

    /**
     * Get idPost
     *
     * @return \AppBundle\Entity\Post 
     */
    public function getIdPost()
    {
        return $this->idPost;
    }

    /**
     * Set idComment
     *
     * @param \AppBundle\Entity\Comment $idComment
     * @return Attachmentimg
     */
    public function setIdComment(\AppBundle\Entity\Comment $idComment = null)
    {
        $this->idComment = $idComment;

        return $this;
    }

    /**
     * Get idComment
     *
     * @return \AppBundle\Entity\Comment 
     */
    public function getIdComment()
    {
        return $this->idComment;
    }

    /**
     * Set idChat
     *
     * @param \AppBundle\Entity\Tchat $idChat
     * @return Attachmentimg
     */
    public function setIdChat(\AppBundle\Entity\Tchat $idChat = null)
    {
        $this->idChat = $idChat;

        return $this;
    }

    /**
     * Get idChat
     *
     * @return \AppBundle\Entity\Tchat 
     */
    public function getIdChat()
    {
        return $this->idChat;
    }
}
